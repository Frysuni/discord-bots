const { MessageEmbed } = require('discord.js');

const CustomRoles = ['831266186473898044', '833087411391168524', '758058997164277911', '830428400006463498', '918125367217229854', '924780135855570995', '758057078706274436', '922422172276908032', '904867744271466537', '819558070656434226', '918126086804623392', '758058873876905986'];
const AntonID = '553919330966831114';
const GasVoiceID = '759405810421202944';
const FireVoiceID = '758048687481159690';
const TrashVoiceID = '914425178715463730';
const ShitVoiceID = '831265729608548382';


const BanConfirmEmbed = new MessageEmbed()
    .setColor('#50c878')
    .setTitle('Успешно забанен!')
    .setDescription('Так решил Фрус и все вопросы лично к нему, бот тут ни при чем ;)')
    .setFooter({ text: 'Система захвата власти.', iconURL: 'https://files.fryshost.ru/assets/Hopa.png' });
const GasConfirmEmbed = new MessageEmbed()
    .setColor('#50c878')
    .setTitle('Участник перенесён в газовую камеру. Газ запущен.');
const FireConfirmEmbed = new MessageEmbed()
    .setColor('#50c878')
    .setTitle('Участник закинут в печь. Тащите дрова.');
const TrashConfirmEmbed = new MessageEmbed()
    .setColor('#50c878')
    .setTitle('Участник выкинут в бочку. Кеша блять, съебись отсюда уже нахуй.');
const ShitConfirmEmbed = new MessageEmbed()
    .setColor('#50c878')
    .setTitle('Ержан вставай! Ты обосрался! У нас священник дристает, на помощь!');

function checkArray(ArrayOne, ArrayTwo) {
    let result = false;
    ArrayOne.forEach(ElementOne => {
        ArrayTwo.forEach(ElementTwo => {
            if (ElementOne === ElementTwo) result = true;
        });
    });
    return result;
}

const Responce = [
    'Ты че, долбаеб?',
    'Тебе нельзя, уебок',
    'Ахуел? Ты еблан.',
    'Без проблем.. Так стоп нахуй, погодите.. Ты кто, уебок?',
    'Пиздуй лесом',
    'Ага, ага, так я и повелся, нахуй пошел.',
    'Антон, ты долбаеб?',
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
    const RandomInt = Math.floor(Math.random() * 20);
    return Responce[RandomInt];
}


async function VoiceFeatures(message) {
    if (message.content.endsWith('goodbye')) {
        Ban(message, message.content.split(' '));
    }
    else if (message.content.startsWith('почистить')) {
        Clear(message, message.content.split(' '));
    }
    else if (message.content.endsWith('пустить газ')) {
        Gas(message, message.content.split(' '));
    }
    else if (message.content.endsWith('сжечь')) {
        Fire(message, message.content.split(' '));
    }
    else if (message.content.endsWith('выбросить')) {
        Trash(message, message.content.split(' '));
    }
    else if (message.content.endsWith('дать слабительное')) {
        Shit(message, message.content.split(' '));
    }
    else if (message.content.endsWith('роль')) {
        Role(message, message.content.split(' '));
    }
    else if (message.content == 'список пермсов') {
        CheckPerms(message);
    }
}

async function Ban(message, split) {
    if (message.member.user.id != process.env.ADMIN_ID && split.length == 2 && message.content.startsWith('<@')) {
        message.reply(takeRandomResponce());
        return;
    }
    else if (message.member.user.id == process.env.ADMIN_ID && split.length == 3 && message.content.startsWith('<@')) {
        try {
            message.guild.members.cache.get(message.mentions.users.first().id).ban({ reason: 'Небесная кара бана, так решил Фрус, все вопросы к нему, а не к боту.' });
            message.reply({ embeds: [BanConfirmEmbed] });
        } catch (e) {
            message.reply('АнтиКрашБота: Что-то пошло не так.\n' + `\`\`\`${e}\`\`\``);
        }
    }
}

async function Clear(message, split) {
    if (message.member.user.id != process.env.ADMIN_ID && !message.member.permissions.has('ADMINISTRATOR') && split.length == 2) {
        message.reply(takeRandomResponce());
        return;
    }
    else if ((message.member.user.id == process.env.ADMIN_ID || message.member.permissions.has('ADMINISTRATOR')) && split.length == 2) {
        try {
            if (split[1] > 100) {
                return;
            }
            message.guild.channels.cache.get(message.channelId).bulkDelete(split[1], true);

        } catch (e) {
            message.reply('АнтиКрашБота: Что-то пошло не так.\n' + `\`\`\`${e}\`\`\``);
        }
    }
}

async function Gas(message, split) {
    if (message.member.user.id != AntonID && split.length == 3 && message.content.startsWith('<@')) {
        message.reply(takeRandomResponce());
        return;
    }
    else if (message.member.user.id == AntonID && split.length == 3 && message.content.startsWith('<@')) {
        try {
            message.guild.members.cache.get(message.mentions.users.first().id).voice.setChannel(message.guild.channels.cache.get(GasVoiceID));
            message.reply({ embeds: [GasConfirmEmbed] });
        } catch (e) {
            message.reply('АнтиКрашБота: Что-то пошло не так.\n' + `\`\`\`${e}\`\`\``);
        }
    }
}

async function Fire(message, split) {
    if (message.member.user.id != AntonID && split.length == 2 && message.content.startsWith('<@')) {
        message.reply(takeRandomResponce());
        return;
    }
    else if (message.member.user.id == AntonID && split.length == 2 && message.content.startsWith('<@')) {
        try {
            message.guild.members.cache.get(message.mentions.users.first().id).voice.setChannel(message.guild.channels.cache.get(FireVoiceID));
            message.reply({ embeds: [FireConfirmEmbed] });
        } catch (e) {
            message.reply('АнтиКрашБота: Что-то пошло не так.\n' + `\`\`\`${e}\`\`\``);
        }
    }
}

async function Trash(message, split) {
    if (!checkArray(message.member._roles, CustomRoles) && split.length == 2 && message.content.startsWith('<@')) {
        message.reply(takeRandomResponce());
        return;
    }
    else if (checkArray(message.member._roles, CustomRoles) && split.length == 2 && message.content.startsWith('<@')) {
        try {
            message.guild.members.cache.get(message.mentions.users.first().id).voice.setChannel(message.guild.channels.cache.get(TrashVoiceID));
            message.reply({ embeds: [TrashConfirmEmbed] });
        } catch (e) {
            message.reply('АнтиКрашБота: Что-то пошло не так.\n' + `\`\`\`${e}\`\`\``);
        }
    }
}

async function Shit(message, split) {
    if (!checkArray(message.member._roles, CustomRoles) && split.length == 3 && message.content.startsWith('<@')) {
        message.reply(takeRandomResponce());
        return;
    }
    else if (checkArray(message.member._roles, CustomRoles) && split.length == 3 && message.content.startsWith('<@')) {
        try {
            message.guild.members.cache.get(message.mentions.users.first().id).voice.setChannel(message.guild.channels.cache.get(ShitVoiceID));
            message.reply({ embeds: [ShitConfirmEmbed] });
        } catch (e) {
            message.reply('АнтиКрашБота: Что-то пошло не так.\n' + `\`\`\`${e}\`\`\``);
        }
    }
}

async function Role(message, split) {
    if (message.member.user.id != process.env.ADMIN_ID && split.length == 3 && message.content.startsWith('<@')) {
        return;
    }
    else if (message.member.user.id == process.env.ADMIN_ID && split.length == 3 && message.content.startsWith('<@')) {
        await message.guild.roles.fetch();
        try {
            const member = message.guild.members.cache.get(message.mentions.users.first().id);
            if (checkArray(member._roles, split)) {
                member.roles.remove(split[1]);
            }
            else {
                member.roles.add(split[1]);
            }
            message.delete();
        } catch (e) {
            message.reply('АнтиКрашБота: Что-то пошло не так.\n' + `\`\`\`${e}\`\`\``);
        }
    }
}

async function CheckPerms(message) {
    let AllPerms = '';
    const perms = message.guild.me.permissions.toArray();
    for (let i = 0; i < perms.length; i++) {
        AllPerms = AllPerms + perms[i] + '\n';
    }
    const PermsEmbed = new MessageEmbed()
        .setColor('#50c878')
        .setTitle('Список всех разрешений бота.')
        .addFields({ name: 'Вот они все, что есть:', value: AllPerms })
        .setFooter({ text: 'Система захвата власти.', iconURL: 'https://files.fryshost.ru/assets/Hopa.png' });

    message.reply({ embeds: [PermsEmbed] });
}

module.exports = { VoiceFeatures };