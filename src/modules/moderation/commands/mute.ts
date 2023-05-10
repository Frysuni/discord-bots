import Logger from '@logger';
import { ChatInputCommandInteraction, EmbedBuilder, GuildChannel, GuildMember, GuildMemberRoleManager, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js';
import { muteMember } from '..';
import { isMuted } from '../database';

export const data = new SlashCommandBuilder()
    .setName('mute')
    .setNameLocalization('ru', 'мьют')

    .setDescription('Замутить участника на этом сервере.')

    .addUserOption(member => member
        .setName('member')
        .setNameLocalization('ru', 'участник')

        .setDescription('Выберите участника для мута.')

        .setRequired(true))

    .addStringOption(time => time
        .setName('time')
        .setNameLocalization('ru', 'время')

        .setDescription('Например: 1м | 1ч | 1д | 1н | 1мес . Так же можно 1ч2д - 1 час и 2 дня.')

        .setRequired(true))

    .addStringOption(reason => reason
        .setName('reason')
        .setNameLocalization('ru', 'причина')

        .setDescription('Укажите причину мута.'))


    .addChannelOption(channel => channel
        .setName('channel')
        .setNameLocalization('ru', 'канал')

        .setDescription('Канал, в котором участник не сможет отправлять сообщения. Если не указано - выдается тайм-аут'))

    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);


export const execute = async (interaction: ChatInputCommandInteraction) => {
    const member = interaction.options.getMember('member') as GuildMember;
    const reason = interaction.options.getString('reason') ?? `${interaction.user.tag}: Причина не указана.`;
    const time = interaction.options.getString('time');
    const channel = interaction.options.getChannel('channel') as GuildChannel;

    const moderatorRolePosition = (interaction.member.roles as GuildMemberRoleManager).highest.rawPosition;
    const memberRolePosition    = (member.roles as GuildMemberRoleManager).highest.rawPosition;

    if (member.user.bot) {
        sendErrorEmbed('Не стоит пробовать замутить бота.', interaction);
        return;
    }
    if (member.user.id == interaction.user.id) {
        sendErrorEmbed('Я не стану мутить тебя.', interaction);
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
    if (channel && (channel.isVoiceBased() || channel.isThread() || channel.isDMBased())) {
        sendErrorEmbed('Пожалуйста, укажите текстовый канал.', interaction);
        return;
    }
    // TypeScipt жалуется на member.isCommunicationDisabled()
    if (member.communicationDisabledUntilTimestamp > Date.now() || await isMuted(member.id)) {
        sendErrorEmbed('Участник уже в муте.', interaction);
        return;
    }
    const timestamp = Date.now() + await parseTime(time) * 1000;
    if (isNaN(timestamp)) {
        sendErrorEmbed(`Строку "${time}" не удалось понять как дату.`, interaction);
        return;
    }

    if (channel) {
        muteMember(member, channel as TextChannel, timestamp.toString());

        const message = await interaction.reply({ ephemeral: false, embeds: [
            successEmbed.setAuthor({ name: `Участник ${member.user.tag} успешно замучен!`, iconURL: member.displayAvatarURL() })
        ] });

        Logger.Discord(`Модератор <@${interaction.user.id}> **замутил** участника <@${member.id}> в канале ${channel.name} на **${time}** по причине **${reason}**\n` +
                       `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${message.id}`);
    }
    else {
        await member.disableCommunicationUntil(timestamp, reason);

        const message = await interaction.reply({ ephemeral: false, embeds: [
            successEmbed.setAuthor({ name: `Участник ${member.user.tag} успешно замучен!`, iconURL: member.displayAvatarURL() })
        ] });

        Logger.Discord(`Модератор <@${interaction.user.id}> **выдал таймаут** участнику <@${member.id}> на **${time}** по причине **${reason}**\n` +
                       `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${message.id}`);

    }
};

function sendErrorEmbed(reason: string, interaction: ChatInputCommandInteraction) {
    errorEmbed.setTitle(reason);
    interaction.reply({ embeds: [errorEmbed], ephemeral: true });
}

const errorEmbed = new EmbedBuilder().setColor('Red');
const successEmbed = new EmbedBuilder().setColor('Green');

/**
 * Это очень непонятная функция, разбираться не стоит.
 * Я тестировал ее много раз, проблем с ней нет.
 * @param time "56м1 2н00 мес1д" (56 минут, 1 день, 12 недель)
 * @returns 7347360 секунд || NaN
 */
async function parseTime(time: string) {
    const timeArray: Array<string> = time.toLowerCase().replace(' ', '').split('');
    let resultTime = 0;

    if (timeArray.includes('м') && timeArray[timeArray.indexOf('м') + 1] != 'е') {
        const minutes = popNumber(timeArray, timeArray.indexOf('м') - 1);
        if (isNaN(minutes)) return NaN;
        resultTime += minutes * 60;
    }
    if (timeArray.includes('ч')) {
        const hours = popNumber(timeArray, timeArray.indexOf('ч') - 1);
        if (isNaN(hours)) return NaN;
        resultTime += hours * 3600;
    }
    if (timeArray.includes('д')) {
        const days = popNumber(timeArray, timeArray.indexOf('д') - 1);
        if (isNaN(days)) return NaN;
        resultTime += days * 86400;
    }
    if (timeArray.includes('н')) {
        const weeks = popNumber(timeArray, timeArray.indexOf('н') - 1);
        if (isNaN(weeks)) return NaN;
        resultTime += weeks * 604800;
    }
    if (timeArray.includes('м') && timeArray.includes('е') && timeArray.includes('с')) {
        timeArray.splice(timeArray.indexOf('м') + 1, 2);
        const months = popNumber(timeArray, timeArray.indexOf('м') - 1);
        if (isNaN(months)) return NaN;
        resultTime += months * 2629743;
    }
    if (timeArray.length != 0) return NaN;
    return resultTime;

    function popNumber(array: string[], endIndex: number) {
        let numberString = '';
        let i = endIndex;
        while (i != array.length - 1) {
            if (/[0-9]/.test(array[i])) {
                numberString = array[i] + numberString;
            }
            else {
                array.splice(i + 1, endIndex - i + 1);
                return strictInt(numberString);
            }
            --i;
        }
        return NaN;
    }
    function strictInt(value: string): number {
        if (/[0-9]/.test(value)) return Number(value);
        return NaN;
    }
}

