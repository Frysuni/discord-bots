import { Client, Events, Partials } from 'discord.js';
import envConfig from '@env';
import Logger, { setDiscordChannel } from '@logger';
import { connectDB } from '@database';
import deploySlash from '../utils/deploySlash';
import events from '@handlers/events';
import modules from '@handlers/modules';

const client: Client = new Client({
    partials: [Partials.Message, Partials.Reaction, Partials.GuildMember, Partials.User],
	intents: 3276799
});

client.once(Events.ClientReady, async () => {
    if (client.guilds.cache.values.length > 1) {
        Logger.Error('Блять! Бот запущен в несольких гилдах. ОСТАНОВКА!!');
        process.exit();
    }
    await setDiscordChannel();
    Logger.Info('Бот запущен. Версия: ' + envConfig.version);
    Logger.Discord('Бот запущен. Версия: ' + envConfig.version);
    setTimeout(() => require('../utils/crashHandler'), 1000);
    client.user.setStatus('idle');
    client.user.setPresence({ status: 'idle', activities: [] });
});

export default client;

function fetchAll() {
    return Promise.all([
        client.guilds.cache.first().channels.fetch(undefined, { cache: true, force: true }),
        client.guilds.cache.first().members.fetch({ force: true })
    ]);
}
(async function() {
    Logger.Info('Предпрогрузка систем...');
    await connectDB();
    await Promise.all([deploySlash(), events(client)]);
    await client.login(envConfig.token);
    await fetchAll();
    modules();
})();

