require('dotenv').config();

const { Client, Intents } = require('creator.js');

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_PRESENCES,
	] });

require('../events/eventer.js')(client);

client.login(process.env.TOKEN);