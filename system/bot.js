require('dotenv').config();

const { Client, Intents } = require('discord.js');

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
	] });

require('../events/index.js')(client);

client.login(process.env.TOKEN);