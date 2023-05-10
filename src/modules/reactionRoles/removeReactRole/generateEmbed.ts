import client from '@client';
import { EmbedBuilder } from 'discord.js';
import { EmojiType } from '../typings';

export default async function(records: { emoji: { type: EmojiType, content: string }, roleId: string, link: string, id: number }[]) {

    const embed = new EmbedBuilder().setColor('LuminousVividPink').setTitle('Выберите объекты ReactRole для удаления:');
    const rotations = records.length % 7 == 0 ? records.length / 7 : ~~(records.length / 7 + 1);

    for (let i = rotations; i > 0; i--) {
        embed.addFields({
            name: '\u200B',
            inline: true,
            value: await (async () => {
                let result = '';
                const firstSeven = records.slice(0, 7);
                records = records.splice(7);
                firstSeven.forEach((record) => {
                    const emoji = record.emoji.type == EmojiType.Unicode ? record.emoji.content : client.guilds.cache.first().emojis.cache.get(record.emoji.content).toString();
                    result += `[**\`${record.id}\`.**](${record.link}) ${emoji} **-** <@&${record.roleId}>\n`;
                });
                return result;
            })()
        });
    }

    return embed;
}