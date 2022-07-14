const { start } = require('../suggestions/firstmessage.js');
const { deletesuggestion } = require('../suggestions/delete.js');

module.exports = (client, message) => {
    if(message.content === 'ASdjhASDkbASPdiUABFDaosudbASikdaSjkdhASIyASkbDASiydASidyhaSDlybaSdu') {
        start(client, message);
    };
    console.log(String(message.content).startWith('!удалить'))
    /*if( await content.keyword.startWith('!удалить') ) {
        deletesuggestion(client, message);
    };*/
}