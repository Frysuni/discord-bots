const { help } = require('../commands/help.js');
const { reactrole } = require('../commands/reactrole.js');

module.exports = {
    async processing(interaction) {
        if (interaction.commandName === 'help') {
            help(interaction);
        }
        else if (interaction.commandName === 'reactrole') {
            reactrole(interaction);
        }
    },
};