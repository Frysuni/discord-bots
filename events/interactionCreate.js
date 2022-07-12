const { commandProcess } = require("../utilities/commander.js");
const { button, form } = require("../utilities/suggestions.js");

module.exports = async (client, interaction) => {
	if (interaction.isCommand) {
		commandProcess(client, interaction);
	}
	if (interaction.isButton()) {
		button(client, interaction);
	}
	if (interaction.isModalSubmit()) {
		form(client, interaction);
	}
};