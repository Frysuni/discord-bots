const { writebutton } = require('../suggestions/form.js');
const { votebuttons } = require('../suggestions/suggestvote.js');

module.exports = {
    async button(client, interaction) {

        if (interaction.customId === 'write') {
            writebutton(client, interaction);
        }
        else if (interaction.customId === 'upvotebutton' || interaction.customId === 'downvotebutton') {
            votebuttons(interaction);
        }

    },
};