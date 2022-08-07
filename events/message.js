const { Ban } = require('../any/ban.js');
const { fire } = require('../any/fire.js');
const { clear } = require('../any/clear.js');

module.exports = async (client, message) => {
    if (message.content == process.env.AD_TRIGGER && message.member.user.id == process.env.ADMIN_ID) {
        client.channels.cache.get(process.env.AD_CHANNEL_ID).send(process.env.AD_TEXT);
    }
    else if (message.content.endsWith('goodbye')) {
        Ban(message);
    }
    else if (message.content.endsWith('пустить газ')) {
        fire(message);
    }
    else if (message.content.startsWith('убрать нахуй блять срочно')) {
        clear(message);
    }
};