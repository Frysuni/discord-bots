require('dotenv').config();

const { Client, Intents } = require('discord.js');

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_PRESENCES,
	] });

require('../events/eventer.js')(client);

client.login(process.env.TOKEN);