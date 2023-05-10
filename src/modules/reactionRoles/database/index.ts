import client from '@client';
import { EntityTable } from '@database';
import { EmojiType, reactRoleAddOptions } from '../typings';
import { reactRole } from './entity';

const table = new EntityTable(reactRole);

export async function createRecord(options: reactRoleAddOptions) {
    const record = new reactRole();
    record.roleId = options.roleId;
    record.messageId = options.messageId;
    record.emoji = JSON.stringify(options.emoji);
    record.channelId = options.channelId;
    return table.set(record);
}

export async function getReactionObject(messageId: string, emoji: string | object): Promise<reactRole | null> {
    const results = await table.list({ where: { messageId } }) as reactRole[];
    if (typeof emoji != 'string') emoji = JSON.stringify(emoji);
    for (const res of results) {
        if (res.emoji == emoji) return res;
    }
    return null;
}

export async function findReactionObject(id: string) {
    const byMsg = await table.find({ messageId: id });
    if (byMsg) return byMsg as reactRole;

    const byRole = await table.find({ roleId: id });
    if (byRole) return byRole as reactRole;

    return null;
}

export async function isPresent(findId: string) {
    if (await findReactionObject(findId)) return true;
    return false;
}

export async function removeRecord(messageId: string) {
    return table.remove({ messageId });
}

export async function listRecords(): Promise<{ emoji: { type: EmojiType, content: string }, roleId: string, link: string, id: number }[] | null> {
    const result = [];
    const records = await table.list({ order: { id: 'ASC' } });
    if (records.length == 0) return null;
    records.forEach((record: reactRole) => {
        result.push({
            emoji: JSON.parse(record.emoji),
            roleId: record.roleId,
            link: `https://discord.com/channels/${client.guilds.cache.first().id}/${record.channelId}/${record.messageId}`,
            id: record.id
        });
    });
    return result;
}

export async function numberOfRecords() {
    return (await table.list()).length;
}

export async function removeRecordById(id: string | number) {
    return table.remove({ id: id.toString() });
}