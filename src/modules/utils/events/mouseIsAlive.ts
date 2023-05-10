import client from '@client';
import envConfig from '@env';
import { Events, Presence, TextBasedChannel } from 'discord.js';

export const type = Events.PresenceUpdate;

export async function execute(oldPresence: Presence, presence: Presence) {
    if (presence.userId != envConfig.utils.mouseMemberId) return;
    online(oldPresence, presence);
    offline(oldPresence, presence);
}

async function online(oldPresence: Presence, presence: Presence) {
    if (presence.status == 'invisible' || presence.status == 'offline') return;
    if (oldPresence) if (oldPresence.status != 'invisible' && oldPresence.status != 'offline') return;

    const channel = client.channels.cache.get(envConfig.utils.pomoykaId) as TextBasedChannel;
    channel.send('**Нихуяяя!!** МЫШЬ В СЕТИ, ЕБАНУТЬСЯ СПИЦЫ ГНУТЬСЯ!');
}

async function offline(oldPresence: Presence, presence: Presence) {
    if (presence.status != 'invisible' && presence.status != 'offline') return;
    if (oldPresence) if (oldPresence.status == 'invisible' || oldPresence.status == 'offline') return;

    const channel = client.channels.cache.get(envConfig.utils.pomoykaId) as TextBasedChannel;
    channel.send('**Оо нет.. мышь опять ливнул.**');
}