import { ChatInputCommandInteraction, Collection, FetchMessagesOptions, Message, SlashCommandBuilder, TextChannel, EmbedBuilder } from 'discord.js';
import client from '@client';
import envConfig from '@env';

export const data = new SlashCommandBuilder()
    .setName('quote')
    .setNameLocalization('ru', 'пацанская-цитата')

    .setDescription('Случайная пацанская цитата.')

    .setDMPermission(false);

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const quoteChannel = client.channels.cache.get(envConfig.utils.quotes_channel_id) as TextChannel;

    let message: Message;
    do {
        message = await getMessage(quoteChannel);
    } while (message.attachments.size > 1 || (message.content.length < 1 && message.attachments.size < 1));

    const embed = new EmbedBuilder()
        .setColor(message.member.displayColor ?? 'Orange')
        .setTimestamp(message.createdTimestamp);

    if (message.content.length > 1) embed.setDescription(message.content);
    if (message.attachments.size > 0) embed.setImage(message.attachments.first().url);
    if (message.mentions.users.size == 1) {
        embed.setAuthor({
            name: 'Автор: ' + message.guild.members.cache.get(message.mentions.users.first().id).displayName,
            iconURL: message.guild.members.cache.get(message.mentions.users.first().id).displayAvatarURL()
        });
    }
    if (message.mentions.users.size > 1) {
        let authors = 'Авторы:';
        message.mentions.users.each(user => {
            authors += ', ' + message.guild.members.cache.get(user.id).displayName;
        });
        embed.setAuthor({
            name: authors,
            iconURL: message.guild.iconURL()
        });
    }

    const replyMessage = await interaction.editReply({ embeds: [embed] });

    if (message.reactions.cache.size < 1) return;

    message.reactions.cache.each(messageReaction => {
        replyMessage.react(messageReaction.emoji);
    });
}

async function getMessage(channel: TextChannel): Promise<Message> {
    const out = new Collection<string, Message<true>>();
    const options: FetchMessagesOptions = { limit: 100 };

    let i = 1;
    while (i != 100) {
        const fetched = await channel.messages.fetch(options);
        fetched.forEach((value, key) => out.set(key, value));

        for (let i = 0; i <= 100; i++) {
            if (fetched.size % 100 != 0) return out.random();
        }

        options.before = out.lastKey();
        i++;
    }
}

