import { getList, removeRecord } from './database';
import client from '@client';
import { TextChannel } from 'discord.js';
import Logger from '@logger';

const workers = new Map();

export async function execute() {
    const deferedMessages = await getList();
    deferedMessages.forEach(deferedMessage => {
        createWorker(deferedMessage.id, JSON.parse(deferedMessage.text), deferedMessage.timestamp, deferedMessage.channelId, deferedMessage.whom);
    });
}

export async function createWorker(id: number, text: string, timestamp: string, channelId: string, whom: string) {
    const sendTime = parseInt(timestamp + '000') - Date.now();

    if (sendTime > 2147483646) {
        setTimeout(() => {
            createWorker(id, text, timestamp, channelId, whom);
        }, 2147483646);
        return;
    }

    const worker = setTimeout(async () => {

        const channel = client.channels.cache.get(channelId) as TextChannel;
        channel.send(text);

        removeRecord(id);

        Logger.Info(`[DeferMessages] Отправлено сообщение. ID:${id}, Channel:${channel.name}`);
    }, (sendTime));

    workers.set(id, worker);
}

export async function removeWorker(id: number) {
    const worker = workers.get(id);
    clearTimeout(worker);
}
