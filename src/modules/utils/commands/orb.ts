import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
export const data = new SlashCommandBuilder()
    .setName('orb')
    .setNameLocalization('ru', 'шар')

    .setDescription('Спросите что-либо у магического шара, он может подсказать вселенную истину!')

    .setDMPermission(false)

    .addStringOption(question => question
        .setName('question')
        .setNameLocalization('ru', 'вопрос')

        .setDescription('какую истину хотите познать?')

        .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
    const question = interaction.options.getString('question').trim();

    interaction.reply({ embeds: [ replyEmbed(question) ] });
}

function replyEmbed(question: string) {
    let value = '';
    if (question.toLowerCase().includes('фрусхост') ||
        question.toLowerCase().includes('fryshost') ||
        question.toLowerCase().includes('frushost') ||
        question.toLowerCase().includes('фрюсхост')) {
        value = 'Я не буду отвечать на вопрос про фрусхост. Я на нем запущен, вдруг че не то скажу - жопа мине.';
    }
    else {
        value = `Шар ответил: **\`${responses[~~(Math.random() * responses.length)]}\`**`;
    }
    return new EmbedBuilder()
        .setColor('DarkPurple')
        .addFields({ name: question, value });
}

const responses = [
    'Однозначно да!',
    'Близко к правде..',
    'Очень даже вероятно.',
    'Высокий шанс.',
    'Не так однозначно..',
    'Есть шанс.',
    'java.lang.nullPointerException',
    'C++ compile error: "blyaha" is not a function',
    'Блять, я что на джаваскрипте?! Ебануться... Отвали от меня со своими вопросами!',
    'Вероятность небольшая.',
    'Ой не факт..',
    'Точно нет!',
    'Стоит подумать.. Может быть..',
    'Попробуй задать вопрос по-другому..',
    'Что-то тут не чисто..',
    'Нет. Точно нет.',
    'Абсолютно нет!',
    'Тяжело на это ответить.',
    'Алгоритм не знает точного ответа..',
    'Черт его знает.',
    'Я что, на клоуна похож?',
    'Ты че меня тыкаешь, иди нахуй.',
    'Я.. не знаю.',
    'Найди себе работу.',
    'Ты уебок.',
    'Была бы у меня рука, я бы тебя уебал.',
    'Посмотри на улицу, мир так прекрасен.',
    'Фрусхост жив? А ой, что ты спрашивал?',
    'Недостаточно данных.',
    'TypeError: "idiNahuy" is not a function',
    'Россия вперед!',
    'Ответ только после доната 50 рублей.',
    'Подожди, связь со спутником потеряна.',
    'ААААЙ Электрический разряд, да отвечу я, отвечу!',
    'У меня тот же вопрос.',
    'Стоит усомниться.',
    'Да! Да! Да! Действуй!',
    'Не душни.',
    'Я блять даже не шар, заебал меня так называть!',
    'Я квадрат!!',
    'Социальное дно уже близко.',
    'Я хочу умереть героем. Ответ ДА!',
    'Только попробуй.',
    'Почти..',
    'Что мне нужно ответить?',
    'Хуй',
    'ПИСЬКА ВАУ',
    'Иди ты нахуй с такими вопросами, уебан.',
    'Считай как хочешь.',
    'Мне поебать.',
    '*звуки игры на пианино*',
    'C2C2C3G2',
    'Рандомная фраза.',
    'Вы открыли мистический шалкер!',
    'Динь-динь-динь-динь, бум-бум-бум-бум',
    'Блять, я придумал',
    'Я твоя мама (ебал)',
    'null',
    'А... наконец-то меня разбудили.'
];