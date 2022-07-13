const { writebutton } = require("../suggestions/form.js");

module.exports = {
    async button(client, interaction) {

        if (interaction.customId === 'write') {
            writebutton(client, interaction);
        }
        else if (interaction.customId === 'upvote' || interaction.customId === 'downvote') {
            votebuttons(client, interaction);
        }

    },
};