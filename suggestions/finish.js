const { logger } = require('../utilities/logger.js');
const { getRecord } = require('./database.js');
const { MessageActionRow, MessageButton } = require('discord.js');

const delbutton = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId('sug_remove')
        .setLabel('Удалить')
        .setStyle('SECONDARY')
        .setEmoji('🗑'),
);

async function editmessage(interaction, record) {
    const upvotes = await record.get('up');
    const downvotes = await record.get('down');
    if (upvotes == downvotes) {
        logger('Голосование в нейтральном состоянии');
        interaction.reply({ content: 'Голосование находится в нейтральном состоянии!', ephemeral: true });
        return;
    }
    const embed = await JSON.parse(record.get('content'));
    const sugmessageId = await record.get('message');
    const resname = (upvotes > downvotes) ? 'В пользу предложения !' : 'Против предложения.';

    const newembed = {
        ...embed,
        fields: [
            ...embed.fields,
            { name: 'Голосование завершено со счетом:', value: `✅** - ${upvotes}** 🛑** - ${downvotes}**`, inline: false },
            { name: resname, value: 'Это было отличное голосование. Повторим?', inline: false },
        ],
        color: (upvotes > downvotes) ? 2981190 : 14171198,
    };
    const channel = interaction.client.channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID);
    channel.messages.fetch(sugmessageId)
        .then(sugmessage => {
            sugmessage.edit({ embeds: [newembed], components: [delbutton] });
    });
}


async function sug_finish(interaction) {
    logger('Завершение предложения с MessageID: ' + interaction.message.id);
    const record = await getRecord(interaction.message.id);
    if (interaction.member.user.id != (await record.get('owner')) && interaction.member.user.id != process.env.ADMIN_ID) {
        logger('Завершение предложения неуспешно, завершитель не владелец.');
        interaction.reply({ content: 'Вы не можете завершить чужое предложение!', ephemeral: true });
        return;
    }

    await editmessage(interaction, record);

}


module.exports = { sug_finish };