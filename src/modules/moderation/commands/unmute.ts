import Logger from '@logger';
import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, GuildMemberRoleManager, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { unmute } from '..';
import { getMember, isMuted } from '../database';

export const data = new SlashCommandBuilder()
    .setName('unmute')
    .setNameLocalization('ru', 'размьют')

    .setDescription('Размутить участника на этом сервере.')

    .addUserOption(member => member
        .setName('member')
        .setNameLocalization('ru', 'участник')

        .setDescription('Выберите участника для мута.')

        .setRequired(true))

    .addStringOption(reason => reason
        .setName('reason')
        .setNameLocalization('ru', 'причина')

        .setDescription('Укажите причину размута.'))


    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);


export const execute = async (interaction: ChatInputCommandInteraction) => {
    const member = interaction.options.getMember('member') as GuildMember;
    const reason = interaction.options.getString('reason') ?? `${interaction.user.tag}: Причина не указана.`;

    const moderatorRolePosition = (interaction.member.roles as GuildMemberRoleManager).highest.rawPosition;
    const memberRolePosition    = (member.roles as GuildMemberRoleManager).highest.rawPosition;

    if (member.user.bot) {
        sendErrorEmbed('Вероятно, бот не может быть размучен.', interaction);
        return;
    }
    if (member.user.id == interaction.user.id) {
        sendErrorEmbed('Что-то не так, не думаешь?.', interaction);
        return;
    }
    if (moderatorRolePosition <= memberRolePosition && memberRolePosition != 0) {
        sendErrorEmbed('У вас недостаточно прав.', interaction);
        return;
    }
    if (!member.moderatable || !member.manageable) {
        sendErrorEmbed('Я не могу сделать этого.', interaction);
        return;
    }

    if (await isMuted(member.id)) {
        unmute(member, (await getMember(member.id)).channelId as string);

        const message = await interaction.reply({ ephemeral: false, embeds: [
            successEmbed.setAuthor({ name: `Участник ${member.user.tag} успешно размучен!`, iconURL: member.displayAvatarURL() })
        ] });

        Logger.Discord(`Модератор <@${interaction.user.id}> **размутил** участника <@${member.id}> по причине **${reason}**\n` +
                       `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${message.id}`);
    }
    else if (member.communicationDisabledUntilTimestamp > Date.now()) {
        await member.disableCommunicationUntil(Date.now(), reason);

        const message = await interaction.reply({ ephemeral: false, embeds: [
            successEmbed.setAuthor({ name: `Участник ${member.user.tag} успешно размучен!`, iconURL: member.displayAvatarURL() })
        ] });

        Logger.Discord(`Модератор <@${interaction.user.id}> **снял таймаут** участнику <@${member.id}> по причине **${reason}**\n` +
                       `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${message.id}`);

    }
    else {
        sendErrorEmbed('Участник не в муте.', interaction);
        return;
    }
};

function sendErrorEmbed(reason: string, interaction: ChatInputCommandInteraction) {
    errorEmbed.setTitle(reason);
    interaction.reply({ embeds: [errorEmbed], ephemeral: true });
}

const errorEmbed = new EmbedBuilder().setColor('Red');
const successEmbed = new EmbedBuilder().setColor('Green');