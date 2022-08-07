const { MessageEmbed } = require('discord.js');

const confirmEmbed = new MessageEmbed()
    .setColor('#50c878')
    .setTitle('Успешно забанен!')
    .setDescription('Так решил Фрус и все вопросы лично к нему, бот тут ни при чем ;)')
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

async function Ban(message) {
    const BanSplit = message.content.split(' ');
    if (message.member.permissions.has('ADMINISTRATOR') && BanSplit.length == 2 && message.content.startsWith('<@')) {
        message.reply('Блять, ты админ, ебланитос в стиле читос, возьми и забань без системы захвата власти, даун.');
        return;
    }
    else if (message.member.user.id != process.env.ADMIN_ID && BanSplit.length == 2 && message.content.startsWith('<@')) {
        message.reply(takeRandomResponce());
        return;
    }
    else if (message.member.user.id == process.env.ADMIN_ID && BanSplit.length == 3 && message.content.startsWith('<@')) {
        try {
            const member = message.mentions.users.first();
            await message.guild.members.cache.get(member.id).ban({ reason: 'Небесная кара бана, так решил Фрус, все вопросы к нему, а не к боту.' });
            message.reply({ embeds: [confirmEmbed] });
        } catch (e) {
            message.reply('АнтиКрашБота: Что-то пошло не так.\n' + `\`\`\`${e}\`\`\``);
        }
    }
}

module.exports = { Ban };