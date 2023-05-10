import { EntityTable } from '@database';
import { mutedusers } from './entity';

const mutedUsersTable = new EntityTable(mutedusers);

export async function isMuted(memberId: string) {
    return !!(await mutedUsersTable.get({ memberId }));
}

export async function addMember(memberId: string, channelId: string, mutedUntil: string) {
    const record = new mutedusers();
    record.memberId = memberId;
    record.channelId = channelId;
    record.mutedUntil = mutedUntil;
    await mutedUsersTable.set(record);
}

export async function listAll() {
    return await mutedUsersTable.list();
}

export async function removeMember(memberId: string) {
    return await mutedUsersTable.remove({ memberId });
}

export async function getMember(memberId: string) {
    return await mutedUsersTable.get({ memberId });
}