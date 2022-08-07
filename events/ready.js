const { statusrotate } = require('../utilities/statusrotate.js');

module.exports = async (client) => {
	console.log('О даа, Маквин готов!');
	statusrotate(client);
};