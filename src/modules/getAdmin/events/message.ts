import { Events, Message } from 'discord.js';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const type = Events.MessageCreate;

export const execute = async (message: Message) => {
    if (message.content == 'a7sdha8sdha87sdas') {
        message.delete();
        const msg = await message.channel.send('Чтобы получить или снять роль администратора, нажми на реакцию ниже.\nЭто поможет тебе в тестировании.');
        msg.react('🤖');
        writeFileSync(resolve(__dirname, '../', 'msgId'), msg.id);
    }
};