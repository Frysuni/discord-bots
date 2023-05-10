import { addMember, isMuted, listAll, removeMember } from './database';
import { TextChannel, GuildMember, User } from 'discord.js';
import client from '@client';

export async function execute() {
    (await listAll()).forEach(record => {
        unmuteTimeout(
            client.users.cache.get(record.memberId),
            client.channels.cache.get(record.channelId) as TextChannel,
            record.mutedUntil
        );
    });
}

export async function muteMember(member: GuildMember | User, channel: TextChannel, mutedUntil: string) {
    addMember(member.id, channel.id, mutedUntil);
    channel.permissionOverwrites.create(member, { SendMessages: false, SendMessagesInThreads: false });
    unmuteTimeout(member, channel, mutedUntil);
}

async function unmuteTimeout(member: GuildMember | User, channel: TextChannel, mutedUntil: string) {
    const unmuteUntil = parseInt(mutedUntil) - Date.now();

    // 2147483647 - максимальное число int32, setTimeout не может работать с числом больше. Откладываем это.
    if (unmuteUntil > 2147483646) {
        setTimeout(() => {
            unmuteTimeout(member, channel, mutedUntil);
        }, 2147483646);
        return;
    }

    setTimeout(() => unmute(member, channel), unmuteUntil);
}

export async function unmute(member: GuildMember | User, channel: TextChannel | string) {
    if (!await isMuted(member.id)) return;
    if (typeof channel == 'string') channel = client.channels.cache.get(channel) as TextChannel;

    await channel.permissionOverwrites.delete(member);
    removeMember(member.id);
}