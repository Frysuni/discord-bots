import Logger from '@logger';
import { Events, Role } from 'discord.js';
import { findReactionObject, removeRecord } from '../database';

export const type = Events.GuildRoleDelete;

export async function execute(role: Role) {
    const reactionRoleObject = await findReactionObject(role.id);
    if (!reactionRoleObject) return;

    removeRecord(reactionRoleObject.messageId);

    Logger.Discord(`**Ай БЛЯТЬ!!** Кто-то удалил роль ${role.toString()}, которая принадлежит системе ReactionRoles!\nЯ автоматически удалил ее из базы, дальше разгребай сам!`);
}