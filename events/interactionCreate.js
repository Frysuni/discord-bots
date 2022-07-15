const { Info } = require('../utilities/logger.js');
const { commandProcess } = require('../utilities/commander.js');
const { form } = require('../suggestions/suggest.js');
const { button } = require('./button.js');

module.exports = async (client, interaction) => {
	if (interaction.isCommand) {
		Info('Интеракция комманды ' + interaction.member.user.username);
		commandProcess(client, interaction);
	}
	if (interaction.isButton()) {
		Info('Интеракция кнопки ' + interaction.member.user.username);
		button(client, interaction);
	}
	if (interaction.isModalSubmit()) {
		Info('Интеракция модалки ' + interaction.member.user.username);
		form(client, interaction);
	}
};