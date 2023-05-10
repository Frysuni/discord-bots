import { Client, Events, Partials } from 'discord.js';
import envConfig from '@env';
import Logger, { setDiscordChannel } from '@logger';
import { connectDB } from '@database';
import deploySlash from '../utils/deploySlash';
import events from '@handlers/events';
import modules from '@handlers/modules';

const client = new Client({
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
	intents: 131071
});

client.once(Events.ClientReady, async () => {
    await setDiscordChannel();
    Logger.Info('Бот запущен.');
    Logger.Discord('Бот запущен.');
    setTimeout(() => require('../utils/crashHandler'), 1000);
});

export default client;

(async function() {
    Logger.Info('Предпрогрузка систем...');
    await connectDB();
    await Promise.all([deploySlash(), events(client)]);
    await client.login(envConfig.token);
    modules();
})();

