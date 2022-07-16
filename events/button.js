const { logger } = require('../utilities/logger.js');
const { writebutton } = require('../suggestions/form.js');
const { votebuttons } = require('../suggestions/suggestvote.js');
const { sug_delete } = require('../suggestions/delete.js');
const { sug_finish } = require('../suggestions/finish.js');


module.exports = {
    async button(client, interaction) {
        if (interaction.customId === 'write') {
            logger('Нажата кнопка write. ' + interaction.member.user.username);
            writebutton(interaction);
        }
        else if (interaction.customId === 'upvotebutton' || interaction.customId === 'downvotebutton') {
            logger('Нажата кнопка ' + interaction.customId + ' . ' + interaction.member.user.username);
            votebuttons(interaction);
        }
        else if (interaction.customId === 'sug_remove') {
            logger('Нажата кнопка ' + interaction.customId + ' . ' + interaction.member.user.username);
            sug_delete(interaction);
        }
        else if (interaction.customId === 'sug_finish') {
            logger('Нажата кнопка ' + interaction.customId + ' . ' + interaction.member.user.username);
            sug_finish(interaction);
        }

    },
};