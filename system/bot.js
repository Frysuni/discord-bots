require('dotenv').config();
const { Client, Intents } = require('discord.js');

const client = new Client({
	intents: [
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_PRESENCES,
	] });

require('../events/eventer.js')(client);
require('../suggestions/suggestions.js')(client);
require('../games/tictaktoe.js')(client);
client.login(process.env.TOKEN);