const { createRecord } = require('./database.js');

async function reactrole(client, interaction) {
    const ReactionID = interaction.options.getString('реакция');
    const Role = interaction.options.getRole('роль');
    const MessageID = interaction.options.getString('id_сообщения');
    console.log(ReactionID, Role, MessageID);
    const channel = interaction.client.channels.cache.get(interaction.channelId);
    channel.messages.fetch(MessageID)
        .then(message => {
            message.react(ReactionID);
        });

    const objecttodb = {
        role: Role,
        reaction: ReactionID,
        message: MessageID,
    };
    await createRecord(objecttodb);

    interaction.reply({ content: 'Ну.. Если ты все правильно сделал, то все создано нормально должно быть. (я не могу проверить:face_exhaling:)', ephemeral: true });
}

module.exports = { reactrole };