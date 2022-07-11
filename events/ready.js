const { statusrotate } = require("../utilities/statusrotate");

module.exports = async (client) => { 
	console.log('Оо даа, Маквин готов!');
	statusrotate(client);
};