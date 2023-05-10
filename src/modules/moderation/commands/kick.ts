import Logger from '@logger';
import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, GuildMemberRoleManager, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('kick')
    .setNameLocalization('ru', 'кик')

    .setDescription('Кикнуть участника с сервера.')

    .addUserOption(member => member
        .setName('member')
        .setNameLocalization('ru', 'участник')

        .setDescription('Выберите участника, которого нужно кикнуть.')

        .setRequired(true))

    .addStringOption(reason => reason
        .setName('reason')
        .setNameLocalization('ru', 'причина')

        .setDescription('Укажите причину кика.'))

    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);


export const execute = async (interaction: ChatInputCommandInteraction) => {
    const member = interaction.options.getMember('member') as GuildMember;
    const reason = interaction.options.getString('reason') ?? `${interaction.user.tag}: Причина не указана.`;

    const moderatorRolePosition = (interaction.member.roles as GuildMemberRoleManager).highest.position;
    const memberRolePosition    = (member.roles as GuildMemberRoleManager).highest.position;

    if (member.user.bot) {
        sendErrorEmbed('Не стоит пробовать кикнуть бота.', interaction);
        return;
    }
    if (member.user.id == interaction.user.id) {
        sendErrorEmbed('Я не стану кикать тебя.', interaction);
        return;
    }
    if (moderatorRolePosition <= memberRolePosition) {
        sendErrorEmbed('У Вас недостаточно прав.', interaction);
        return;
    }
    if (!member.kickable) {
        sendErrorEmbed('Я не могу сделать этого.', interaction);
        return;
    }

    member.kick(reason)
        .then(async () => {
            const message = await interaction.reply({ ephemeral: false, embeds: [
                successEmbed.setAuthor({ name: `Участник ${member.user.tag} успешно кикнут!`, iconURL: member.avatarURL() })
            ] });

            Logger.Discord(`Модератор <@${interaction.user.id}> **кикнул** участника <@${member.id}> (${member.user.tag}) по причине **${reason}**\n` +
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