import { EntityTable } from '@database';
import { deferMessages } from './entity';

const table = new EntityTable(deferMessages);

export async function createRecord(text: string, timestamp: string, channelId: string, whom: string): Promise<number> {
    const record = new deferMessages();
    record.text = JSON.stringify(text);
    record.timestamp = timestamp;
    record.channelId = channelId;
    record.whom = whom;
    return (await table.set(record)).id;
}

export async function getList() {
    return table.list({ order: { timestamp: 'ASC' } });
}

export async function removeRecord(id: number) {
    const record = await table.find({ id });
    if (!record) return null;
    await table.remove(record);
    return record;
}