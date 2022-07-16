const { logger } = require('../utilities/logger.js');
const { reactrole, suggestions } = require('../database/worker.js');
const { statusrotate } = require('../utilities/statusrotate.js');

module.exports = async (client) => {
	require('dotenv').config();
	if (process.env.FORCE_DATABASES) {
		reactrole.sync({ force: true });
		suggestions.sync({ force: true });
	}
	else {
		reactrole.sync();
		suggestions.sync();
	}

	statusrotate(client);
	logger('Бот запущен');
};