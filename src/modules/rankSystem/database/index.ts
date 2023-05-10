import { EntityTable } from '@database';
import { ranksystem } from './entity';

const rankTable = new EntityTable(ranksystem);

export interface ExpMember {
    memberId: string,
    level: number,
    exp: number
}

const ExpMembersCache = new Map();

export async function getExpMember(memberId: string): Promise<ExpMember> {
    if (!ExpMembersCache.has(memberId)) {
        const member = await rankTable.get({ memberId });

        if (!member) addNewMember(memberId);

        ExpMembersCache.set(memberId, {
            memberId,
            level: member?.level ?? 1,
            exp: member?.exp ?? 0
        } as ExpMember);
    }

    return ExpMembersCache.get(memberId);
}

async function addNewMember(memberId: string) {
    const newMember = new ranksystem();
    newMember.level = 1;
    newMember.exp = 0;
    newMember.memberId = memberId;
    rankTable.set(newMember);
}

export async function updateMember(expMember: ExpMember) {
    if (!await rankTable.get({ memberId: expMember.memberId })) return 'not_found';
    ExpMembersCache.delete(expMember.memberId);
    ExpMembersCache.set(expMember.memberId, expMember);

    const member = new ranksystem();
    member.level = expMember.level;
    member.exp = expMember.exp;
    member.memberId = expMember.memberId;
    await rankTable.update({ memberId: member.memberId }, member);
}

export async function getTopMembers(page: number) {
    return rankTable.list({ skip: (page - 1) * 10, take: 10, order: { exp: 'DESC' } });
}

