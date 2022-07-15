require('dotenv').config();
const { start } = require('../suggestions/firstmessage.js');
const { deletesuggestion } = require('../suggestions/delete.js');

module.exports = async (client, message) => {
    if (message.content === process.env.SUGGESTIONS_TRIGGER && message.member.user.id == process.env.ADMIN_ID) {
        start(client, message);
    }
    if (String(message.content).startsWith('!удалить')) {
        deletesuggestion(client, message);
    }
    if (message.content == process.env.AD_TRIGGER && message.member.user.id == process.env.ADMIN_ID) {
        client.channels.cache.get(process.env.AD_CHANNEL_ID).send(process.env.AD_TEXT);
    }
};