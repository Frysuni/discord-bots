import client from '@client';
import envConfig from '@env';
import { Events, GuildMember, EmbedBuilder } from 'discord.js';
import Logger from '@logger';

export const type = Events.GuildMemberRemove;

export async function execute(member: GuildMember) {
    const channel = client.channels.cache.get(envConfig.utils.leave_channel_id);

    if (!channel.isTextBased()) {
        Logger.Error('Неверно настроен leave_channel_id');
        Logger.Discord('Неверно настроен leave_channel_id');
        return;
    }

    const memberJoined = ~~(member.joinedTimestamp / 1000);

    const embed = new EmbedBuilder()
        .setColor('Red')
        .setAuthor({ iconURL: member.displayAvatarURL(), name: `${member.nickname ? member.nickname : member.user.tag} покинул нас сегодня.` })
        .setDescription(member.nickname ? `**${member.user.tag}** ${member.toString()}` : member.toString())
        .setFields({ name: 'Этот человек, возможно, впервые появился в Норе:', value: `<t:${memberJoined}:f> (<t:${memberJoined}:R>)` })
        .setFooter({ iconURL: 'https://files.fryshost.ru/assets/Hopa.png', text: 'Память, которую мы не помним.' })
        .setTimestamp();

    channel.send({ embeds: [embed] });
}