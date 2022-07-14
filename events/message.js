require('dotenv').config();
const { start } = require('../suggestions/firstmessage.js');
const { deletesuggestion } = require('../suggestions/delete.js');

module.exports = async (client, message) => {
    if(message.content === process.env.SECRETSUGGEST && message.member.user.id == 920753536608899092n) {
        start(client, message);
    };
    if(String(message.content).startsWith('!удалить')) {
        deletesuggestion(client, message);
    };
    if(message.content == process.env.SECRET_AD && message.member.user.id == 920753536608899092n) {
        client.channels.cache.get(process.env.AD_CHANNEL_ID).send('\n**Привет.**\n\nЯ - бот этой Норы и отныне я тут всем помогаю.\n\nМой функционал еще не очень большой, но я стараюсь активно развиваюсь и слушаю все предложения связанные со мной.\nКстати, насчет предложений! Зайдите в канал #предлагалка и сами все посмотрите, пока что, это моя основная функция, но я хочу еще выдавать вам роли по реакции и делать разные игры на подобии сапёра или мафии!\n\nВ общем я буду сидеть с вами и наблюдать за ситуацией, если что зовите, всем удачи!');
    };
};