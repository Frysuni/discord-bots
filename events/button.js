const { Info } = require('../utilities/logger.js');
const { writebutton } = require('../suggestions/form.js');
const { votebuttons } = require('../suggestions/suggestvote.js');

module.exports = {
    async button(client, interaction) {
        if (interaction.customId === 'write') {
            Info('Нажата кнопка write. ' + interaction.member.user.username);
            writebutton(client, interaction);
        }
        else if (interaction.customId === 'upvotebutton' || interaction.customId === 'downvotebutton') {
            Info('Нажата кнопка ' + interaction.customId + ' . ' + interaction.member.user.username);
            votebuttons(interaction);
        }

    },
};