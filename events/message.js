const { VoiceFeatures } = require('../any/VoiceFeatures.js');

module.exports = async (client, message) => {
    if (message.content == process.env.AD_TRIGGER && message.member.user.id == process.env.ADMIN_ID) {
        client.channels.cache.get(process.env.AD_CHANNEL_ID).send(process.env.AD_TEXT);
    }
    // eslint-disable-next-line no-constant-condition
    else if (true) {
        VoiceFeatures(message);
    }
};