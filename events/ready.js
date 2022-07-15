const { Info } = require('../utilities/logger.js');
const { suggestions } = require('../database/worker.js');
const { statusrotate } = require('../utilities/statusrotate.js');

module.exports = async (client) => {
	// reactrole.sync();
	suggestions.sync();

	statusrotate(client);
	Info('Бот запущен');
};