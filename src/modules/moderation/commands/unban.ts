import Logger from '@logger';
import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('unban')
    .setNameLocalization('ru', 'разбан')

    .setDescription('Разбанить участника.')

    .addStringOption(member => member
        .setName('member')
        .setNameLocalization('ru', 'участник')

        .setDescription('Введите ID пользователя, либо его ник с тегом (user#1111).')

        .setRequired(true))

    .addStringOption(reason => reason
        .setName('reason')
        .setNameLocalization('ru', 'причина')

        .setDescription('Укажите причину разбана.'))

    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);


export const execute = async (interaction: ChatInputCommandInteraction) => {
    const member = { raw: interaction.options.getString('member'), id: '', tag: '' };
    const reason = interaction.options.getString('reason') ?? `${interaction.user.tag}: Причина не указана.`;

    if (member.raw.split('').includes('#') && !isNaN(parseInt(member.raw.split('#')[1]))) {
        member.tag = member.raw;
    }
    else if (!isNaN(strictInt(member.raw))) {
        member.id = member.raw;
    }
    else {
        sendErrorEmbed('"' + member.raw + '" не удалось понять как ID или nick#tag пользователя.', interaction);
        return;
    }

    await interaction.guild.bans.fetch({ cache: true });
    const guildBanUser = interaction.guild.bans.cache.find(guildBan => guildBan.user.id == member.id || guildBan.user.tag == member.tag)?.user;

    if (!guildBanUser) {
        sendErrorEmbed('Не найдено такого забаненого пользователя.', interaction);
        return;
    }

    interaction.guild.bans.remove(guildBanUser, reason)
        .then(async () => {
            const message = await interaction.reply({ ephemeral: false, embeds: [
                successEmbed.setAuthor({ name: `Участник ${guildBanUser.tag} успешно забанен!`, iconURL: guildBanUser.displayAvatarURL() })
            ] });

            Logger.Discord(`Модератор <@${interaction.user.id}> **разбанил** участника <@${guildBanUser.id}> (${guildBanUser.tag}) по причине **${reason}**\n` +
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

function strictInt(value: string): number {
    if (/[0-9]/.test(value)) return Number(value);
    return NaN;
}