import { ActivityType } from 'discord.js';
import envConfig from '@env';
import client from '@client';


export async function execute() {
    client.user.setPresence({ activities: [{ name: 'Бот запущен.', type: ActivityType.Playing }], status: 'dnd' });
    setInterval(async () => {
        const online = await getMemberPresences();
        if (online == 0) {
            client.user.setPresence({ activities: [{ name: 'NeverPixel один..', type: ActivityType.Playing }], status: 'online' });
            return;
        }
        client.user.setPresence({ activities: [{ name: humanizeNumber(online), type: ActivityType.Watching }], status: 'idle' });
    }, 10000);
}

async function getMemberPresences() {
    let onlineMembers = 0;
    client.guilds.cache.get(envConfig.guild_id).members.cache.each(GuildMember => {
        if (GuildMember.presence?.status && GuildMember.presence?.status != 'offline' && !GuildMember.user?.bot) onlineMembers += 1;
    });
    return onlineMembers;
}

function humanizeNumber(num: number) {
    const online = num.toString();
    if ((online.endsWith('2') || online.endsWith('3') || online.endsWith('4')) && !online.endsWith('12') && !online.endsWith('13') && !online.endsWith('14')) return `на онлайн ${num} человека.`;
    return `на онлайн ${num} человек.`;
}
