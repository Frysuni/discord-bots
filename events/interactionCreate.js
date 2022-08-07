const { command } = require('./command.js');

module.exports = async (client, interaction) => {
	if (interaction.isCommand()) {
		command(client, interaction);
	}
};