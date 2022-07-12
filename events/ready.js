const { reactrole, suggestions } = require("../database/worker");
const { statusrotate } = require("../utilities/statusrotate");

module.exports = async (client) => { 
	reactrole.sync();
	suggestions.sync();

	statusrotate(client);
	
	console.log('Оо даа, Маквин готов!');
};