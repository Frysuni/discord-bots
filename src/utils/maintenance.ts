import { ActivityType, Client } from 'discord.js';

const client: Client = new Client({
	intents: 131071
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    interaction.reply({ ephemeral: true, content: 'Погоди-погоди, у меня тут пока трудности с обработкой твоих комманд.\nЯ сейчас либо обновляюсь, либо сломался нахуй. Фрус уже знает об этом, не переживай.' });
});

(async function() {
    await client.login('bruh');
    client.user.setPresence({ activities: [{ name: 'maintenance'.toUpperCase(), type: ActivityType.Playing }], status: 'dnd' });
})();


/*
client.once(Events.ClientReady, async () => {
    (client.channels.cache.get(envConfig.log_channel_id) as TextChannel)
        .send(`Системы перестали быть активными!\nБот автоматически перешел в режим обслуживания!\n<@920753536608899092> LogCache ID: **\`${~~(Math.random() * 128)}\`**.\nВерсия: ${envConfig.version}`);
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    interaction.reply({ ephemeral: true, content: 'Виноват! Я автоматически перешел в режим обслуживания из-за ошибок в юнит-тестах! Я уже пинганул фруса, чиним!' });
});

(async function() {
    await client.login(envConfig.token);
    client.user.setPresence({ activities: [{ name: 'maintenance'.toUpperCase(), type: ActivityType.Playing }], status: 'dnd' });
})();
*/
