import Logger from '@logger';
import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, GuildTextBasedChannel, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('clear')
    .setNameLocalization('ru', 'очистить')

    .setDescription('Очистить сообщения в этом канале.')

    .addIntegerOption(count => count
        .setName('count')
        .setNameLocalization('ru', 'количество')

        .setDescription('Укажите количество удаляемых сообщений до 100.')

        .setRequired(true))

    .addUserOption(member => member
        .setName('member')
        .setNameLocalization('ru', 'участник')

        .setDescription('Участник, чьи сообщения удалить.'))

    .addChannelOption(channel => channel
        .setName('channel')
        .setNameLocalization('ru', 'канал')

        .setDescription('Канал, где нужно удалить сообщения.'))

    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);


export const execute = async (interaction: ChatInputCommandInteraction) => {
    const count = interaction.options.getInteger('count');
    const member = interaction.options.getMember('member') as GuildMember;
    const channel = interaction.options.getChannel('channel') as GuildTextBasedChannel ?? interaction.channel;

    if (!channel.isTextBased()) {
        sendErrorEmbed('Укажите текстовый канал.', interaction);
        return;
    }
    if (count < 1 || count > 100) {
        sendErrorEmbed('Количество сообщений должно быть от 1 до 100.', interaction);
        return;
    }

    let messages = await channel.messages.fetch({ cache: false }); // .then(messages => messages.filter(message => message.id != interaction.id));
    if (member) messages = messages.filter(message => message.author.id == member.id);

    const limitedMessages = messages.first(count);
    if (limitedMessages.length == 0) {
        sendErrorEmbed('Не найдено сообщений по заданным условиям.', interaction);
        return;
    }

    await channel.bulkDelete(limitedMessages);

    interaction.reply({ embeds: [successEmbed.setTitle(
        `Успешно удалены ${limitedMessages.length} сообщений` +
        `${member?.displayName ? ' пользователя ' + member.displayName : ''}` +
        `${channel.id != interaction.channelId ? ' в канале ' + channel.name : ''}.`
    )] });
    Logger.Discord(
        `Модератор <@${interaction.user.id}> очистил ${limitedMessages.length} сообщений` +
        `${member?.displayName ? ` пользователя <@${member.id}>` : '' }` +
        ` в канале <#${channel.id}>.`
    );
};

function sendErrorEmbed(reason: string, interaction: ChatInputCommandInteraction) {
    errorEmbed.setTitle(reason);
    interaction.reply({ embeds: [errorEmbed], ephemeral: true });
}

const errorEmbed = new EmbedBuilder().setColor('Red');
const successEmbed = new EmbedBuilder().setColor('Green');