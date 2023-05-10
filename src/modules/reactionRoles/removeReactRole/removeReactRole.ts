import { ChatInputCommandInteraction, ActionRowBuilder, SelectMenuBuilder, parseEmoji } from 'discord.js';
import { listRecords } from '../database';
import { EmojiType } from '../typings';
import generateEmbed from './generateEmbed';

export default async function(interaction: ChatInputCommandInteraction) {
    const records = await listRecords();
    if (!records) {
        interaction.reply({ ephemeral: true, content: 'Тут еще нет реактролей. :)' });
        return;
    }

    const selectMenu = new ActionRowBuilder<SelectMenuBuilder>()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId('remove_react_role')
                .setPlaceholder('Вот тут выбирай.')
                .setMaxValues(records.length + 2)
                .addOptions(
                    (() => {
                        const result = [
                            { emoji: parseEmoji('🗑'), label: 'Удалить реакции', description: '[ОПЦИЯ] Удалить все реакции пользователей.', value: 'remove_reactions' },
                            { emoji: parseEmoji('🟥'), label: 'Забрать роли', description: '[ОПЦИЯ] Забрать эти роли у всех участников.', value: 'remove_roles' }
                        ];

                        records.forEach((record) => {
                            const emoji = record.emoji.type == EmojiType.Unicode ? record.emoji.content : interaction.guild.emojis.cache.get(record.emoji.content).toString();
                            result.push({ emoji: parseEmoji(emoji), label: record.id.toString(), description: `Роль: ${interaction.guild.roles.cache.get(record.roleId).name}`, value: record.id.toString() });
                        });

                        return result;
                    })()
                )
        );

    const embed = await generateEmbed(records);

    interaction.reply({ ephemeral: true, embeds: [embed], components: [selectMenu] });
}