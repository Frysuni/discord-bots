import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('dice')
    .setNameLocalization('ru', 'кость')

    .setDescription('Бросить кость со случайным числом. (mex312)')

    .setDMPermission(false)

    .addIntegerOption(maxNumber => maxNumber
        .setName('max_num')
        .setNameLocalization('ru', 'максимум')

        .setMinValue(2)
        .setMaxValue(65534)

        .setDescription('Максимальное число граней кости.'));

export async function execute(interaction: ChatInputCommandInteraction) {
    const maxNumber = interaction.options.getInteger('max_num');

    const random = maxNumber ? ~~(Math.random() * maxNumber + 1) : ~~(Math.random() * 6 + 1);

    let result = `Выпало число **${random}** !`;

    if (random == new Date().getMinutes()) result += '\nИменно столько минут на моих часах. :)';
    if (random == new Date().getHours()) result += '\nВероятно, это потому, что сейчас ' + random + ' часов.';
    if (random == new Date().getDay()) result += '\nПрикинь, сегодня ' + random + ' день недели, совпадение.';
    if (random == new Date().getDate()) result += '\nКстати, сегодня тоже ' + random + ' день.';
    if (random == new Date().getMonth() + 1) result += '\nЧто-что? Сегодня ' + random + ' месяц?';
    if (random == new Date().getFullYear()) result += '\nМне тут процессор подсказывает, что сейчас точно такой же год.. Как ты выбил это число? Черная магия...';

    interaction.reply(result);
}