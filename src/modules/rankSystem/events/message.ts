import envConfig from '@env';
import { Events, Message, GuildTextBasedChannel } from 'discord.js';
import { calculateExpForLvl } from '..';
import { getExpMember, updateMember } from '../database';

const maxXp = parseInt(envConfig.rankSystem.expPerMsg.split('-')[1]);
const minXp = parseInt(envConfig.rankSystem.expPerMsg.split('-')[0]);

export const type = Events.MessageCreate;

export const execute = async (message: Message) => {
    if (!message.inGuild()) return;
    if (message.author.bot) return;
    if (message.system) return;
    if (message.content.length <= 2) return;
    if (cooldown(message.author.id)) return;

    const randomXP = ~~(Math.random() * (maxXp - minXp + 1) + minXp);

    const ExpMember = await getExpMember(message.author.id);
    ExpMember.exp += randomXP;

    if (ExpMember.exp >= calculateExpForLvl(ExpMember.level + 1)) {
        ExpMember.level++;
        const adChannel = message.guild.channels.cache.get(envConfig.rankSystem.adChannelId) as GuildTextBasedChannel;
        if (ExpMember.level == envConfig.rankSystem.rewardRoleLvl) {
            const guildMember = message.guild.members.cache.get(message.author.id);
            const rewardRole = message.guild.roles.cache.get(envConfig.rankSystem.rewardRoleId);

            guildMember.roles.add(rewardRole, `Достигнут ${envConfig.rankSystem.rewardRoleLvl} уровень.`);

            adChannel.send(`**Несите тортик!** <@${message.author.id}> получил роль "\`${rewardRole.name}\`", достигнув уровня **${ExpMember.level}** !`);
        }
        else {
            adChannel.send(`**${message.author.username}** получил **${ExpMember.level}** уровень.`);
        }
    }
    updateMember(ExpMember);

};

const cooldownSet = new Set();
function cooldown(memberId: string) {
    if (cooldownSet.has(memberId)) return true;
    cooldownSet.add(memberId);
    setTimeout(() => cooldownSet.delete(memberId), 10000);
    return false;
}