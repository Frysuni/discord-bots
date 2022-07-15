require('dotenv').config();
const { getRecord, updateUsers } = require('./database.js');

async function checker(interaction) {
    const record = await getRecord(interaction.message.id);
    const users = await record.get('users');
    const usersarray = (users) ? users.split(' ') : null;
    if (usersarray != null) {
        for (let i = usersarray.length - 1; i >= 0; --i) {
            if (interaction.member.user.id == usersarray[i]) {
                interaction.reply({ content: 'Ты уже проголосовал, ты не можешь голосовать еще раз.', ephemeral: true });
                return false;
            }
        }
    }
    if (interaction.member.user.id == record.get('owner')) {
        interaction.reply({ content: 'Ты создал это предложение, ты не можешь за него голосовать.', ephemeral: true });
        return false;
    }
}

async function listuser(record) {
    const users = await record.get('users');
    const usersarray = (users) ? users.split(' ') : null;
    let listusers = '';
    for (let i = usersarray.length - 1; i >= 0; --i) {
        if (i === 0) {
            listusers = listusers + ` <@${usersarray[i]}>.`;
        }
        else if (i === (usersarray.length - 1)) {
            listusers = listusers + `<@${usersarray[i]}>,`;
        }
        else {
            listusers = listusers + ` <@${usersarray[i]}>,`;
        }
    }
    return listusers;
}

async function adduser(record, interaction) {
    const users = await record.get('users');
    let usersstr = '';
    if (users == null) {
        usersstr = interaction.member.user.id;
    }
    else {
        usersstr = users + ' ' + interaction.member.user.id;
    }
    updateUsers(usersstr, interaction.message.id);
}
async function editmessage(interaction) {
    const record = await getRecord(interaction.message.id);
    const embed = await JSON.parse(record.get('content'));
    const upvotes = await record.get('up');
    const downvotes = await record.get('down');
    const users = await listuser(record);

    const newembed = {
        ...embed,
        fields: [
            ...embed.fields,
            { name: `✅** - ${upvotes}**`, value: `🛑** - ${downvotes}**`, inline: false },
            { name: 'Уже проголосовали:', value: users, inline: false },
        ],
        color: (upvotes > downvotes) ? 2981190 : (upvotes === downvotes) ? 16698446 : 14171198,
    };
    const channel = interaction.client.channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID);
    channel.messages.fetch(interaction.message.id)
        .then(message => {
            message.edit({ embeds: [newembed] });
        });
}
async function upvote(interaction) {
    if (await checker(interaction) != false) {
        const record = await getRecord(interaction.message.id);
        await record.increment('up');
        adduser(record, interaction);
        editmessage(interaction);
        interaction.reply({ content: 'Ваш голос ЗА был оставлен!', ephemeral: true });
    }
}

async function downvote(interaction) {
    if (await checker(interaction) != false) {
        checker(interaction);
        const record = await getRecord(interaction.message.id);
        await record.increment('down');
        adduser(record, interaction);
        editmessage(interaction);
        interaction.reply({ content: 'Ваш голос против был оставлен!', ephemeral: true });
    }
}

module.exports = {
    votebuttons(interaction) {
        if (interaction.customId === 'upvotebutton') {
            upvote(interaction);
        }
        else if (interaction.customId === 'downvotebutton') {
            downvote(interaction);
        }
    },
};