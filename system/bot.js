require('dotenv').config();

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
const allactivities = [
	{ name: 'Hope c RR ботом', type: 'COMPETING' },
	{ name: 'новые предложения', type: 'WATCHING' },
	{ name: '/help', type: 'LISTENING' },
];
let i = 0;
client.on('ready', () => {
	console.log('Оо даа, Маквин готов!');
	setInterval(() => {
		i = (i++) % allactivities.length;
		const activities = allactivities[i];
	
		client.user.setActivity(activities.name, { type: activities.type });
	}, 3000);
});

client.login(process.env.TOKEN);