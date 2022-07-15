require('dotenv').config();
const { rmRecord, getRecordById } = require('./database.js');

async function checkid(message) {
    const commandarray = message.content.split(' ');

    if (commandarray.length > 2) {
        message.reply('Введено более 1го аргумента, попробуйте `!удалить {ID}`')
            .then (responsemsg => {
                setTimeout(() => {
                    responsemsg.delete();
                    message.delete();
                }, 3000);
            });
        return false;
    }

    if (commandarray[0] != '!удалить') {
        message.reply('Неверно введена команда, попробуйте `!удалить {ID}`')
            .then (responsemsg => {
                setTimeout(() => {
                    responsemsg.delete();
                    message.delete();
                }, 3000);
            });
        return false;
    }

    if (commandarray.length == 1) {
        message.reply('Не введен аргумент, попробуйте `!удалить {ID}`')
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
        message.reply('Аргумент должен быть числом, попробуйте `!удалить {ID}`')
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
    if (message.member.user.id != owner && message.member.user.id != '920753536608899092') {
        message.reply('Вы не можете удалить чужое предложение!')
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

async function deletesuggestion(client, message) {
    const checkidresponce = await checkid(message);
    if (checkidresponce === false) return;
    const record = await getRecordById(checkidresponce);
    const sugmessageId = await record.get('message');

    const channel = message.client.channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID);
    channel.messages.fetch(sugmessageId)
        .then(sugmessage => {
            sugmessage.delete();
    });

    rmRecord(checkidresponce);

    message.reply(`Ваше предложение под номером ${checkidresponce} было успешно удалено!`)
    .then (responsemsg => {
        setTimeout(() => {
            responsemsg.delete();
            message.delete();
        }, 3000);
    });

}


module.exports = { deletesuggestion };