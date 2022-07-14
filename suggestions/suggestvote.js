require('dotenv').config();
const { getRecord } = require('./database.js');

async function checker(interaction) {
    const record = await getRecord(interaction.message.id);

    if (interaction.member.user.id != record.get('owner')) {
        interaction.reply({ content: 'Ты создал это предложение. Голосовать тебе не дано.', ephemeral: true });
    };
    //if (interaction.member.user.id == record.get('users'))
}

async function editmessage(interaction) {
    const record = await getRecord(interaction.message.id);
    const embed = await JSON.parse(record.get('content'));
    const upvotes = await record.get('up');
    const downvotes = await record.get('down');
    newembed = {
        ...embed,
        fields: [
            ...embed.fields,
            { name: upvotes, value: '2', inline: true },
            //{ name: '123', value: '123', inline: true },
            //{ name: downvotes, value: '🛑', inline: true },
        ],
        color: (upvotes > downvotes) ? 2981190 : (upvotes === downvotes) ? 16698446 : 14171198
    };
    const channel = interaction.client.channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID);
    channel.messages.fetch(interaction.message.id)
        .then(message => {
            message.edit({ embeds: [newembed] });
        });
}
async function upvote(interaction) {
    checker(interaction);
    const record = await getRecord(interaction.message.id);
    await record.increment('up')
    editmessage(interaction);
    interaction.reply({ content: `Ваш голос ЗА был оставлен!`, ephemeral: true})
}

async function downvote(interaction) {
    checker(interaction);
    const record = await getRecord(interaction.message.id);
    await record.increment('down');
    editmessage(interaction);
    interaction.reply({ content: `Ваш голос против был оставлен!`, ephemeral: true})
}

module.exports = {
    votebuttons(interaction) { 
        if (interaction.customId === 'upvotebutton') {
            upvote(interaction);
        }
        else if (interaction.customId === 'downvotebutton') {
            downvote(interaction);
        }
    }
}