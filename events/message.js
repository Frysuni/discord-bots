require('dotenv').config();
const { start } = require('../suggestions/firstmessage.js');
const { deletesuggestion } = require('../suggestions/delete.js');

module.exports = (client, message) => {
    if(message.content === process.env.SECRETSUGGEST) {
        start(client, message);
    };
    if(String(message.content).startsWith('!удалить')) {
        deletesuggestion(client, message);
    };
};