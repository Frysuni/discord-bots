const { MessageEmbed } = require('discord.js');

const confirmEmbed = new MessageEmbed()
    .setColor('#50c878')
    .setTitle('Успешно!')
    .setDescription('Участник перенесён в газовую камеру. Газ запущен.')
    .setTimestamp()
    .setFooter({ text: 'Система захвата власти.', iconURL: 'https://files.fryshost.ru/assets/Hopa.png' });

const Responce = [
    'Ты че, долбаеб?',
    'Тебе нельзя, уебок',
    'Ахуел? Ты еблан.',
    'Без проблем.. Так стоп нахуй, погодите.. Ты кто, уебок?',
    'Пиздуй лесом',
    'Ага, ага, так я и повелся, нахуй пошел.',
    'Антон, ты долбаеб?',
    '```TypeError: Cannot read properties of undefined (reading \'id\')```',
    '```TypeError: гандон блять```',
    'Запускаю лаунчер для тетриса...',
    '.',
    'Хуй у тебя в жопе',
    'Открой порно и дрочи хуй, а не меня',
    'ыыыыыыыыыыы',
    'Долбаебы, вы перегружаете фрусхост',
    'Лучше бы в предлагалку что-нибудь предложил',
    'лучше бы пайтон',
    'и вообще ты гей',
    'микроигра пройдена',
    '123',
    '321',
];
function takeRandomResponce() {
    const RandomInt = Math.floor(Math.random() * 21);
    return Responce[RandomInt];
}

async function fire(message) {
    const FireSplit = message.content.split(' ');
    if (message.member.permissions.has('ADMINISTRATOR') && FireSplit.length == 3 && message.content.startsWith('<@')) {
        message.reply('Блять, ты админ, ебланитос в стиле читос, возьми и перенеси его без системы захвата власти, даун.');
        return;
    }
    else if (message.member.user.id != '553919330966831114' && FireSplit.length == 3 && message.content.startsWith('<@')) {
        message.reply(takeRandomResponce());
        return;
    }
    else if (message.member.user.id == '553919330966831114' && FireSplit.length == 3 && message.content.startsWith('<@')) {
        try {
            const member = message.guild.members.cache.get(message.mentions.users.first().id);
            const channel = message.guild.channels.cache.get('759405810421202944');
            member.voice.setChannel(channel);
            message.reply({ embeds: [confirmEmbed] });
        } catch (e) {
            message.reply('АнтиКрашБота: Что-то пошло не так.\n' + `\`\`\`${e}\`\`\``);
        }
    }
}

module.exports = { fire };