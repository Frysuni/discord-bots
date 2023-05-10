/* eslint-disable no-console */
import writeToFile from './filesystem';
import envConfig from '@env';
import { ChannelType, MessageCreateOptions, MessagePayload, TextBasedChannel } from 'discord.js';
import client from '@client';

const time = async (): Promise<string> => new Intl.DateTimeFormat('en-EU', { hour: '2-digit', hourCycle: 'h23', minute: '2-digit', second: '2-digit' }).format(new Date());

const format = (type: string, data: string): string => data.replace('\n', '\n          ' + type + ' ');

async function Info(data: string): Promise<void> {
    const formData = format('[  INFO ]', data);
    const timeString = await time();
    writeToFile(`[${timeString}][  INFO ] ${formData}`);
    console.log(`[${timeString}][  INFO ] ${formData}`);
}

async function Debug(data: string) {
    if (!envConfig.debug) return;

    const formData = format('[ DEBUG ]', data);
    const timeString = await time();
    writeToFile(`[${timeString}][ DEBUG ] ${formData}`);
    console.debug(`[${timeString}][ DEBUG ] ${formData}`);

}
async function Error(data: string) {
    const formData = format('[ ERROR ]', data);
    const timeString = await time();
    writeToFile(`[${timeString}][ ERROR ] ${formData}`);
    console.error(`[${timeString}][ ERROR ] ${formData}`);
}

// Вот это безобразие, из-за того, что логгер - низкоуровневый и используется до запуска бота.
// (client.channels.cache.get просто выдаст ошибку, если использован до client.login())
let discordChannel: TextBasedChannel;
export async function setDiscordChannel() {
    discordChannel = client.channels.cache.get(envConfig.log_channel_id) as TextBasedChannel;
    if (discordChannel.type != ChannelType.GuildText) {
        await Error('Неверно указан Discord log channel');
        process.exit();
    }
}
async function Discord(data: string | MessagePayload | MessageCreateOptions) {
    discordChannel.send(data);
}

export default { Info, Debug, Error, Discord };