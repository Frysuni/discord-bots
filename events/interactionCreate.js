const { logger } = require('../utilities/logger.js');
const { commandProcess } = require('../utilities/commander.js');
const { form } = require('../suggestions/suggest.js');
const { button } = require('./button.js');

module.exports = async (client, interaction) => {
	if (interaction.isCommand()) {
		logger('Интеракция комманды ' + interaction.member.user.username);
		commandProcess(client, interaction);
	}
	if (interaction.isButton()) {
		logger('Интеракция кнопки ' + interaction.member.user.username);
		button(client, interaction);
	}
	if (interaction.isModalSubmit()) {
		logger('Интеракция модалки ' + interaction.member.user.username);
		form(client, interaction);
	}
};