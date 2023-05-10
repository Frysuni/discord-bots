import { Events, MessageReaction, User } from 'discord.js';
import { getReactionObject } from '../database';
import { EmojiType } from '../typings';

export const type = Events.MessageReactionRemove;

export async function execute(msgReaction: MessageReaction, user: User) {
    if (user.bot) return;

    const emoji = {
        type: msgReaction.emoji.id ? EmojiType.Discord : EmojiType.Unicode,
        content: msgReaction.emoji.id ?? msgReaction.emoji.name
    };

    const reactionObject = await getReactionObject(msgReaction.message.id, emoji);
    if (!reactionObject || reactionObject.emoji != JSON.stringify(emoji)) return;

    const member = msgReaction.message.guild.members.cache.get(user.id);
    const role = msgReaction.message.guild.roles.cache.get(reactionObject.roleId);

    member.roles.remove(role);
}