require('dotenv').config();

const { statusrotate } = require('../utilities/statusrotate.js');
const { processing } = require('./commands.js');
const { Client, Intents } = require('discord.js');
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
	] });

client.on('interactionCreate', async interaction => {
	if (interaction.isCommand) {
		await processing(interaction);
	}
});

client.once('ready', () => {
	console.log('Оо даа, Маквин готов!');
	statusrotate(client);
});

client.login(process.env.TOKEN);