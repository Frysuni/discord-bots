const { logger } = require('../utilities/logger.js');
const { rmRecord, getRecord } = require('./database.js');


async function sug_delete(interaction) {
    logger('Удаление предложения с MessageID: ' + interaction.message.id);
    const record = await getRecord(interaction.message.id);
    if (interaction.member.user.id != (await record.get('owner')) && interaction.member.user.id != process.env.ADMIN_ID) {
        logger('Удаление предложения неуспешно, удалитель не владелец.');
        interaction.reply({ content: 'Вы не можете удалить чужое предложение!', ephemeral: true });
        return;
    }
    const sugmessageId = await record.get('message');

    const channel = interaction.client.channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID);
    channel.messages.fetch(sugmessageId)
        .then(sugmessage => {
            sugmessage.delete();
    });

    rmRecord(interaction.message.id);
    interaction.reply({ content: 'Предложение успешно удалено!', ephemeral: true });

}


module.exports = { sug_delete };