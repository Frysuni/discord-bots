const { help } = require('../commands/help.js');
const { ping } = require('../commands/ping.js');
const { server } = require('../commands/server.js');
const { user } = require('../commands/user.js');

module.exports = {
    async command(client, interaction) {
        if (interaction.commandName === 'help') {
            help(interaction);
        }
        else if (interaction.commandName === 'ping') {
            ping(interaction);
        }
        else if (interaction.commandName === 'server') {
            server(interaction);
        }
        else if (interaction.commandName === 'user') {
            user(client, interaction);
        }
    },
};