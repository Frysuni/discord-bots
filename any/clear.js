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

async function clear(message) {
    const ClearSplit = message.content.split(' ');
    if (message.member.user.id != process.env.ADMIN_ID && !message.member.permissions.has('ADMINISTRATOR') && ClearSplit.length == 5) {
        message.reply(takeRandomResponce());
        return;
    }
    else if ((message.member.user.id == process.env.ADMIN_ID || message.member.permissions.has('ADMINISTRATOR')) && ClearSplit.length == 5) {
        try {
            if (ClearSplit[4] > 100) {
                return;
            }
            const channel = message.guild.channels.cache.get(message.channelId);
            channel.bulkDelete(ClearSplit[4], true);

        } catch (e) {
            message.reply('АнтиКрашБота: Что-то пошло не так.\n' + `\`\`\`${e}\`\`\``);
        }
    }
}

module.exports = { clear };