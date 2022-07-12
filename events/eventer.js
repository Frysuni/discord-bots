module.exports = (client) => {
    client.once('ready', ()=>require('./ready.js')(client));
    client.on('interactionCreate', (interaction)=>require('./interactionCreate.js')(client, interaction));
    client.on('guildMemberRemove', (member)=>require('./guildMemberRemove.js')(client, member));
    client.on('messageCreate', (message)=>require('./message.js')(client, message));
};