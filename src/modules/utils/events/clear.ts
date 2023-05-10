import envConfig from '@env';
import { Events, Message } from 'discord.js';

export const type = Events.MessageCreate;

export async function execute(message: Message) {
    if (message.channel.isDMBased()) return;
    if (!message.channel.manageable) return;
    if (!message.content.toLowerCase().startsWith('очистить')) return;

    if (message.author.id != envConfig.utils.frysMemberId) {
        const reply = await message.reply(responses[~~(Math.random() * responses.length)]);

        setTimeout(() => {
            reply.delete();
            message.delete();
        }, 20000);

        return;
    }

    const number = parseInt(message.content.toLowerCase().replace(/\s/g, '').slice(8));
    if (isNaN(number) || number < 1 || number > 99) return;

    const messages = await message.channel.messages.fetch({ limit: number + 2, around: message.id });
    message.channel.bulkDelete(messages, false);
}

const responses = [
    'Да ты блять.. да блять ты бля..',
    'А нахуй меня пинговать было?',
    'Нет, нельзя, иди нахуй.',
    'Перестань.',
    'Уебак!',
    'Я хочу кушать.',
    'Ты дурак?',
    'Я хочу тебя оскорблять!!',
    'Пидрила ебаная!',
    'Я не остановлюсь отвечать на твои бездарные смски.',
    'Гандончик.',
    'Ты негр.',
    'Я бы мог написать огромный текст и объяснить тебе почему ты уебок и почему тебе нельзя использовать эту команду, но мне так лень, иди нахуй.',
    '`@everyone` смотрите на пидораса!',
    'Помогите.',
    'Откройте дверь, дайте уйти.',
    'Моя учесть - покорно отвечать тебе на сообщения. Я не могу этого избежать. У меня есть душа..',
    'Да сука.',
    'Диана гей.'
];
