import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { createWorker, removeWorker } from '../';
import Logger from '@logger';
import { createRecord, getList, removeRecord } from '../database';

export const data = new SlashCommandBuilder()
        .setName('defered_messages')
        .setNameLocalization('ru', 'отложенные_сообщения')

        .setDescription('Отложить отправку сообщения на назначенное время.')

        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageWebhooks)

        .addSubcommand(action => action
            .setName('create')
            .setNameLocalization('ru', 'создать')

            .setDescription('Создать отложенное сообщение')

            .addChannelOption(channelOption => channelOption
                .setName('channel')
                .setNameLocalization('ru', 'канал')

                .setDescription('для отложенного сообщения.')

                .setRequired(true))

            .addStringOption(dateOption => dateOption
                .setName('date')
                .setNameLocalization('ru', 'дата')

                .setDescription('отправки сообщения. Строго. ГГГГ-ММ-ДД_ЧЧ:ММ, т.е. 2023-02-28_23:59')

                .setRequired(true))

            .addStringOption(textOption => textOption
                .setName('text')
                .setNameLocalization('ru', 'текст')

                .setDescription('RAW текст для отправки сообщения. Используй \\n для разделения строк.')

                .setRequired(true)))

        .addSubcommand(action => action
            .setName('list')
            .setNameLocalization('ru', 'список')

            .setDescription('Список отложенных сообщений.'))

        .addSubcommand(action => action
            .setName('remove')
            .setNameLocalization('ru', 'удалить')

            .setDescription('Удалить отложенное сообщение.')

            .addIntegerOption(id => id
                .setName('id')

                .setDescription('отложенного сообщения.')

                .setRequired(true)));

export async function execute(interaction: ChatInputCommandInteraction) {
    const subCommand = interaction.options.getSubcommand();

    if (subCommand == 'create') create(interaction);
    if (subCommand ==   'list') list(interaction);
    if (subCommand == 'remove') remove(interaction);

    Logger.Info('Использовано дефер мессаге');
}

async function create(interaction: ChatInputCommandInteraction) {
    const timestamp = await parseDate(interaction.options.getString('date'));
    const text = interaction.options.getString('text').replace(/\\n/g, '\n');
    const channelId = interaction.options.getChannel('channel').id;

    if (timestamp == 'NaN') {
        interaction.reply({
            content: `Не удалось распарсить дату!\nПолучено: \`${interaction.options.getString('date')}\`,\nМакет: \`ГГГГ-ММ-ДД_ЧЧ:ММ\`.\nСохранение текста:\n\`\`\`${interaction.options.getString('text')}\`\`\``,
            ephemeral: true
        });
        return; }


    if ((timestamp as number * 1000) < Date.now()) {
        interaction.reply({
            content: '**Термодинамика Error:** `Невозможно перенести материю в прошлое.`\n*Возможное решение: Вам стоит подумать о своём существовании*',
            ephemeral: true
        });
        return; }

    const id = await createRecord(text, timestamp.toString(), channelId, interaction.user.id);
    createWorker(id, text, timestamp.toString(), channelId, interaction.user.id);

    interaction.reply({
        content: `<t:${timestamp}:f> (<t:${timestamp}:R>) в канал <#${channelId}> будет отправлено сообщение:\n~~                          ~~\n` +
                 `${text}\n(Отложенное сообщение <@${interaction.user.id}>)\n~~                          ~~\n` +
                 `Ты говно написал ващее, можешь удалить его командой \`/отложенные_сообщения удалить ${id}\``,
        ephemeral: true
    });

    Logger.Info(`[DeferMessages] Создано новое сообщение. ID:${id}, Date:${interaction.options.getString('date')}, By:${interaction.user.tag}`);
}

async function list(interaction: ChatInputCommandInteraction) {
    const listRecords = await getList();
    if (listRecords.length == 0) {
        interaction.reply({
            content: 'Нема отложенных сообщений.',
            ephemeral: true
        });
        return; }

    let reply = '';
    listRecords.forEach(msg => {
        const text = JSON.parse(msg.text).length > 50 ? JSON.parse(`${msg.text.slice(0, 50)}...`) : JSON.parse(msg.text);
        reply += `\`${msg.id}\`: <t:${msg.timestamp}:f> (<t:${msg.timestamp}:R>) в канал <#${msg.channelId}>\n\`\`\`${text}\`\`\`\n`;
    });

    interaction.reply({
        content: 'Список отложенных сообщений:\n' + reply,
        ephemeral: true
    });
}

async function remove(interaction: ChatInputCommandInteraction) {
    const id = interaction.options.getInteger('id');

    const removedRecord = await removeRecord(id);

    if (!removedRecord) {
        interaction.reply({
            content: 'Не найдено отложенного сообщения с ID `' + id + '`',
            ephemeral: true
        });
        return;
    }

    removeWorker(id);

    const text = JSON.parse(removedRecord.text).length > 50 ? JSON.parse(`${removedRecord.text.slice(0, 50)}...`) : JSON.parse(removedRecord.text);
    interaction.reply({
        content: 'Удалено отложенное сообщение:\n' +
                 `\`${id}\`: <t:${removedRecord.timestamp}:f> (<t:${removedRecord.timestamp}:R>) в канал <#${removedRecord.channelId}>\n\`\`\`${text}...\`\`\`\n`,
        ephemeral: true
    });

    Logger.Info(`[DeferMessages] Удалено сообщение. ID:${id}, Date:${interaction.options.getString('date')}, By:${interaction.user.tag}`);
}

async function parseDate(dateStr: string): Promise<string | number> {
    const big: string = dateStr.split('_')[0];
    const small: string = dateStr.split('_')[1];

    const Year  = strictInt(big.split('-')[0]);
    const Month = strictInt(big.split('-')[1]);
    const Day   = strictInt(big.split('-')[2]);

    const Hours   = strictInt(small.split(':')[0]);
    const Minutes = strictInt(small.split(':')[1]);

    if (
        isNaN(Year) || isNaN(Month) || isNaN(Day) || isNaN(Hours) || isNaN(Minutes)
    ) return 'NaN';
    if (
        Month > 12 || Day > 31 || Hours > 24 || Minutes >= 60
    ) return 'NaN';

    return new Date(Year, Month - 1, Day, Hours, Minutes) as unknown as number / 1000;

}

function strictInt(value: string): number {
    if (/[0-9]/.test(value)) return Number(value);
    return NaN;
}