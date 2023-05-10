import Logger from '@logger';
import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, GuildMemberRoleManager, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('ban')
    .setNameLocalization('ru', 'бан')

    .setDescription('Забанить участника на этом сервере.')

    .addUserOption(member => member
        .setName('member')
        .setNameLocalization('ru', 'участник')

        .setDescription('Выберите участника для бана.')

        .setRequired(true))

    .addStringOption(reason => reason
        .setName('reason')
        .setNameLocalization('ru', 'причина')

        .setDescription('Укажите причину бана.')

        .setRequired(true))

    .addBooleanOption(deleteMessages => deleteMessages
        .setName('delete_messages')
        .setNameLocalization('ru', 'удалить_сообщения')

        .setDescription('Удалить сообщения участника за последний день?')

        .setRequired(true))

    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);


export const execute = async (interaction: ChatInputCommandInteraction) => {
    const member = interaction.options.getMember('member') as GuildMember;
    const reason = interaction.options.getString('reason');
    const delete_messages = interaction.options.getBoolean('delete_messages');

    const moderatorRolePosition = (interaction.member.roles as GuildMemberRoleManager).highest.rawPosition;
    const memberRolePosition    = (member.roles as GuildMemberRoleManager).highest.rawPosition;

    if (member.user.bot) {
        sendErrorEmbed('Не стоит пробовать забанить бота.', interaction);
        return;
    }
    if (member.user.id == interaction.user.id) {
        sendErrorEmbed('Я не стану банить тебя.', interaction);
        return;
    }
    if (moderatorRolePosition <= memberRolePosition && memberRolePosition != 0) {
        sendErrorEmbed('У Вас недостаточно прав.', interaction);
        return;
    }
    if (!member.bannable) {
        sendErrorEmbed('Я не могу сделать этого.', interaction);
        return;
    }

    member.ban({ reason: reason, deleteMessageSeconds: delete_messages ? 86400 : 0 })
        .then(async () => {
            const message = await interaction.reply({ ephemeral: false, embeds: [
                successEmbed.setAuthor({ name: `Участник ${member.user.tag} успешно забанен!`, iconURL: member.avatarURL() })
            ] });

            Logger.Discord(`Модератор <@${interaction.user.id}> **забанил** участника <@${member.id}> (${member.user.tag}) по причине **${reason}**\n` +
                           `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${message.id}`);
        })
        .catch(() => sendErrorEmbed('Мне не удалось этого сделать.', interaction));
};

function sendErrorEmbed(reason: string, interaction: ChatInputCommandInteraction) {
    errorEmbed.setTitle(reason);
    interaction.reply({ embeds: [errorEmbed], ephemeral: true });
}

const errorEmbed = new EmbedBuilder().setColor('Red');
const successEmbed = new EmbedBuilder().setColor('Green');