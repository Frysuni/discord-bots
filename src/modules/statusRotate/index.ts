// import { ActivityType, PresenceUpdateStatus } from 'discord.js';
// import client from '@client';

// export async function execute__DISABLED__() {
//     client.user.setPresence({ activities: [{ name: 'Всем привет!', type: ActivityType.Playing }], status: PresenceUpdateStatus.Idle });
//     await new Promise(res => setTimeout(res, 5000));
//     // eslint-disable-next-line no-constant-condition
//     while (true) {
//         const presences = await getMembersPresences();
//         if (presences.length == 0) {
//             client.user.setPresence({ activities: [{ name: 'FrysHost один..', type: ActivityType.Playing }], status: PresenceUpdateStatus.Idle });
//             await new Promise(res => setTimeout(res, 10000));
//         }
//         for (const activityName of presences) {
//             client.user.setPresence({ activities: [{ name: activityName, type: ActivityType.Playing }], status: PresenceUpdateStatus.Idle });
//             await new Promise(res => setTimeout(res, 30000));
//         }
//     }


// }

// async function getMembersPresences() {
//     const presences: string[] = [];
//     const members = await client.guilds.cache.first().members.fetch();
//     members.each(GuildMember => {
//         if (!GuildMember.user?.bot && GuildMember.presence?.activities?.length) {
//             GuildMember.presence.activities.forEach(activity => {
//                 if (activity.type != ActivityType.Playing) return;
//                 presences.push(activity.name);
//             });
//         }
//     });
//     return presences;
// }

// export async function execute() {
//     client.user.setPresence({ activities: [{ name: 'Бот запущен.', type: ActivityType.Playing }], status: 'dnd' });
//     setInterval(async () => {
//         const online = await getMemberPresences();
//         if (online == 0) {
//             client.user.setPresence({ activities: [{ name: 'FrysHost один..', type: ActivityType.Playing }], status: 'online' });
//             return;
//         }
//         client.user.setPresence({ activities: [{ name: humanizeNumber(online), type: ActivityType.Watching }], status: 'idle' });
//     }, 10000);
// }

// async function getMemberPresences() {
//     let onlineMembers = 0;
//     client.guilds.cache.first().members.cache.each(GuildMember => {
//         if (GuildMember.presence?.status && GuildMember.presence?.status != 'offline' && !GuildMember.user?.bot) onlineMembers += 1;
//     });
//     return onlineMembers;
// }

// function humanizeNumber(num: number) {
//     const online = num.toString();
//     if ((online.endsWith('2') || online.endsWith('3') || online.endsWith('4')) && !online.endsWith('12') && !online.endsWith('13') && !online.endsWith('14')) return `на онлайн ${num} человека.`;
//     return `на онлайн ${num} человек.`;
// }
