require('dotenv').config();
const { Info } = require('../utilities/logger.js');
const { getRecordById } = require('./database.js');

async function checkid(message) {
    const commandarray = message.content.split(' ');

    if (commandarray.length > 2) {
        Info('!завршить, но Введено более 1го аргумента');
        message.reply('Введено более 1го аргумента, попробуйте `!завершить {ID}`')
            .then (responsemsg => {
                setTimeout(() => {
                    responsemsg.delete();
                    message.delete();
                }, 3000);
            });
        return false;
    }

    if (commandarray[0] != '!завершить') {
        Info('!завершить, но Неверно введена команда');
        message.reply('Неверно введена команда, попробуйте `!завершить {ID}`')
            .then (responsemsg => {
                setTimeout(() => {
                    responsemsg.delete();
                    message.delete();
                }, 3000);
            });
        return false;
    }

    if (commandarray.length == 1) {
        Info('!завершить, но Не введен аргумент');
        message.reply('Не введен аргумент, попробуйте `!завершить {ID}`')
            .then (responsemsg => {
                setTimeout(() => {
                    responsemsg.delete();
                    message.delete();
                }, 3000);
            });
        return false;
    }

    const id = Number(commandarray[1]);
    if (isNaN(id)) {
        Info('!завершить, но Аргумент должен быть числом');
        message.reply('Аргумент должен быть числом, попробуйте `!завершить {ID}`')
            .then (responsemsg => {
                setTimeout(() => {
                    responsemsg.delete();
                    message.delete();
                }, 3000);
            });
        return false;
    }

    const record = await getRecordById(id);
    if (!record) {
        Info(`!завершить, но Предложения с ID ${id} несуществует`);
        message.reply(`Предложения с ID ${id} несуществует, проверьте его в своем предложении.`)
            .then (responsemsg => {
                setTimeout(() => {
                    responsemsg.delete();
                    message.delete();
                }, 3000);
            });
        return false;
    }

    const owner = await record.get('owner');
    if (message.member.user.id != owner && message.member.user.id != process.env.ADMIN_ID) {
        Info('!завершить, но Вы не можете завершить чужое предложение!');
        message.reply('Вы не можете завершить чужое предложение!')
            .then (responsemsg => {
                setTimeout(() => {
                    responsemsg.delete();
                    message.delete();
                }, 3000);
            });
        return false;
    }
    const ups = await record.get('up');
    const downs = await record.get('down');
    if (ups == downs) {
        Info('!завершить, но Голосование находится в нейтральном состоянии, невозможно завершить!');
        message.reply('Голосование находится в нейтральном состоянии, невозможно завершить!')
            .then (responsemsg => {
                setTimeout(() => {
                    responsemsg.delete();
                    message.delete();
                }, 3000);
            });
        return false;
    }
    return id;
}

async function editmessage(message, id) {
    const record = await getRecordById(id);
    const embed = await JSON.parse(record.get('content'));
    const upvotes = await record.get('up');
    const downvotes = await record.get('down');
    const sugmessageId = await record.get('message');
    const resname = (upvotes > downvotes) ? 'В пользу предложения !' : 'Против предложения.';

    const newembed = {
        ...embed,
        fields: [
            ...embed.fields,
            { name: 'Голосование завершено со счетом:', value: `✅** - ${upvotes}** 🛑** - ${downvotes}**`, inline: false },
            { name: resname, value: 'Это было отличное голосование. Может предложим новое?', inline: false },
        ],
        color: (upvotes > downvotes) ? 2981190 : 14171198,
    };
    const channel = message.client.channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID);
    channel.messages.fetch(sugmessageId)
        .then(sugmessage => {
            sugmessage.edit({ embeds: [newembed], components: [] });
    });
}


async function endsuggestion(client, message) {
    const checkidresponce = await checkid(message);
    if (checkidresponce === false) return;
    Info('Завершение предложения с ID ' + checkidresponce);

    await editmessage(message, checkidresponce);

    message.reply(`Ваше предложение под номером ${checkidresponce} было завершено!`)
    .then (responsemsg => {
        setTimeout(() => {
            responsemsg.delete();
            message.delete();
        }, 3000);
    });

}


module.exports = { endsuggestion };