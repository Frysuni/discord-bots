const { commandProcess } = require("../system/commands");

module.exports = async (interaction) => {
	if (interaction.isCommand) {
		commandProcess(interaction);
}};