const { start } = require('../suggestions/firstmessage.js');

module.exports = (client, message) => {
    if(message.content === 'ASdjhASDkbASPdiUABFDaosudbASikdaSjkdhASIyASkbDASiydASidyhaSDlybaSdu') {
        start(client, message);
    };
}