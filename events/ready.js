const { reactrole, suggestions } = require("../database/worker.js");
const { statusrotate } = require("../utilities/statusrotate.js");

module.exports = async (client) => { 
	//reactrole.sync();
	suggestions.sync();

	statusrotate(client);
	
	console.log('Оо даа, Маквин готов!');
};