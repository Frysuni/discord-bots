import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import cacheCommands from '@handlers/commands';
import Logger from '@logger';
import envConfig from '@env';

export default async () => {
	const commands: string[] = [];
	const handledCommands = cacheCommands();

	Object.keys(handledCommands).forEach(command => {
		commands.push(handledCommands[command].data);
	});

	const rest = new REST({ version: '10' }).setToken(envConfig.token);

	const data = await rest.put(
		Routes.applicationCommands(envConfig.client_id),
		{ body: commands }
	);

	if (data instanceof Array) Logger.Debug(`Обновлены ${data.length} слэш-комманд.`);
	else throw new Error('Не удалось обновить слеш-комманды');
};