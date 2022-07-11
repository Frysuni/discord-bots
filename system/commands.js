const { help } = require('../commands/help.js');
const { reactrole } = require('../commands/reactrole.js');
const { ping } = require('../commands/ping.js');
module.exports = {
    async processing(interaction) {
        if (interaction.commandName === 'help') {
            help(interaction);
        }
        else if (interaction.commandName === 'reactrole') {
            reactrole(interaction);
        }
        else if (interaction.commandName === 'ping') {
            ping(interaction);
        }
    },
};