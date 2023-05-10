import client from '@client';
import { ChatInputCommandInteraction, Role, Guild, parseEmoji, Message } from 'discord.js';
import { createRecord, getReactionObject, isPresent, numberOfRecords } from './database';
import { reactRoleAddOptions, EmojiType, validateRoleError, validateEmojiError } from './typings';

export default async function(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const rawOptions = {
        role: interaction.options.getRole('role') as Role,
        emoji: interaction.options.getString('emoji')
    };
    const options: reactRoleAddOptions = {
        roleId: '',
        emoji: { type: EmojiType.Undefined, content: '' },
        messageId: interaction.options.getString('message_id').trim(),
        channelId: ''
    };

    if (await numberOfRecords() >= 23) {
        interaction.reply({ ephemeral: true, content: 'Пока-что нельзя создать более 23х реактролей' });
        return;
    }

    switch (await validateRole(rawOptions.role)) {
        case validateRoleError.Unmoderatable:
            interaction.editReply({ content: 'Упс.. Мне не хватает прав для работы с этой ролью.' });
            return;
        case validateRoleError.AlreadySetted:
            interaction.editReply({ content: 'Не-не, эта роль уже занята на другую реакцию.' });
            return;
        case validateRoleError.EveryoneRole:
            interaction.editReply({ content: 'Ну.. нет. Ты же специально это сделал?' });
            return;
        default:
            options.roleId = rawOptions.role.id;
            break;
    }

    const validatedEmoji = validateEmoji(rawOptions.emoji, interaction.guild);
    switch (validatedEmoji) {
        case validateEmojiError.NoEmoji:
            interaction.editReply({ content: 'Вы неправильно указали эмодзи!' });
            return;
        case validateEmojiError.MultipleEmojis:
            interaction.editReply({ content: 'Нет, несколько эмодзи не пойдет!' });
            return;
        case validateEmojiError.UnreachableEmoji:
            interaction.editReply({ content: 'Аоаоаоа, я не могу использовать это эмодзи!' });
            return;
        default:
            options.emoji = validatedEmoji;
            break;
    }

    const reactionObject = await getReactionObject(options.messageId, JSON.stringify(options.emoji));
    if (reactionObject && reactionObject.emoji == JSON.stringify(options.emoji)) {
        interaction.editReply({ content: 'Запись с таким messageId и таким же эмодзи уже есть в базе.' });
        return;
    }
    const message = await findMessage(options.messageId);
    if (!message) {
        interaction.editReply({ content: 'Сообщения с таким ID не найдено!' });
        return;
    }
    options.channelId = message.channelId;

    if (options.emoji.type == EmojiType.Discord) {
        const emoji = interaction.guild.emojis.cache.get(options.emoji.content);
        message.react(emoji);
    }
    else { message.react(options.emoji.content); }

    createRecord(options);

    interaction.editReply({ content: 'Отлично, это мы сделали!' });
}

async function validateRole(role: Role) {
    const comparedPosition = client.guilds.cache.first().members.me.roles.highest.comparePositionTo(role);
    if (comparedPosition <= 0) return validateRoleError.Unmoderatable;
    if (role.name.includes('everyone')) return validateRoleError.EveryoneRole;
    if (await isPresent(role.id)) return validateRoleError.AlreadySetted;
    return role;
}
function validateEmoji(str: string, guild: Guild) {
    const unicodeEmojis = getUnicodeEmojis(str);
    const discordEmojiId = parseEmoji(str)?.id;

    if (unicodeEmojis.length == 0 && !discordEmojiId) return validateEmojiError.NoEmoji;

    if (unicodeEmojis.length > 1) return validateEmojiError.MultipleEmojis;
    if ((str.match(/>/g) ?? []).length > 1) return validateEmojiError.MultipleEmojis;
    if (str.match(/>/g) && unicodeEmojis.length > 0) return validateEmojiError.MultipleEmojis;

    if (discordEmojiId && !guild.emojis.cache.has(discordEmojiId)) return validateEmojiError.UnreachableEmoji;

    if (unicodeEmojis.length > 0) return { type: EmojiType.Unicode, content: unicodeEmojis[0] };
    if (discordEmojiId) return { type: EmojiType.Discord, content: discordEmojiId };
}

function getUnicodeEmojis(str: string): string[] {
    const regex = /[(\p{Emoji_Presentation}|\p{Extended_Pictographic})\u200d]+/gu;
    // @ts-expect-error ошибки не должно быть в TSv.^4.7.0
    const splitEmojis = (string: string) => [...new Intl.Segmenter().segment(string)].map(x => x.segment);
    const parsedEmojis = [];
    (str.match(regex) ?? []).every((emoji) => parsedEmojis.push(...splitEmojis(emoji)));
    return parsedEmojis;
}


async function findMessage(messageId: string): Promise<Message | null> {
    const channels = (await client.guilds.cache.first().channels.fetch()).values();

    for (const channel of channels) {
        if (channel.isTextBased()) {
            await channel.messages.fetch({ around: messageId, cache: true, limit: 3 });
            if (channel.messages.cache.has(messageId)) return channel.messages.cache.get(messageId);
        }
    }

    return null;
}