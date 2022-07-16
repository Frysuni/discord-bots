const { getRecord, updateUsers } = require('./database.js');

async function checker(interaction) {
    const record = await getRecord(interaction.message.id);
    if (interaction.member.user.id == record.get('owner')) {
        interaction.reply({ content: 'Ты создал это предложение, ты не можешь за него голосовать.', ephemeral: true });
        return false;
    }
}

async function listuser(record) {
    const users = JSON.parse(await record.get('users'));
    const usersarray = Object.keys(users);
    let listusers = '';
    for (let i = usersarray.length - 1; i >= 0; --i) {
        if (i === 0) {
            listusers += ` <@${usersarray[i]}>.`;
        }
        else if (i === (usersarray.length - 1)) {
            listusers += `<@${usersarray[i]}>,`;
        }
        else {
            listusers += ` <@${usersarray[i]}>,`;
        }
    }
    return listusers;

}

async function adduser(record, interaction, value) {
    let usersobj = JSON.parse(await record.get('users'));
    const userid = interaction.member.user.id;
    if (!usersobj) {
        usersobj = {};
        usersobj[userid] = value;
    }
    else {
        usersobj[userid] = value;
    }

    const usersstr = JSON.stringify(usersobj);

    updateUsers(usersstr, interaction.message.id);
}
async function editmessage(interaction) {
    const record = await getRecord(interaction.message.id);
    const embed = JSON.parse(await record.get('content'));
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
            message.edit({ content: '\u200B', embeds: [newembed] });
        });
}

async function alreadyVote(interaction, record) {
    const users = JSON.parse(await record.get('users'));
    if (!users) return false;
    if (users[interaction.member.user.id] == 'up') return 'up';
    if (users[interaction.member.user.id] == 'down') return 'down';
    return false;
}

async function upvote(interaction) {
    const check = await checker(interaction);
    if (check == false) return;
    const record = await getRecord(interaction.message.id);
    const checkVote = await alreadyVote(interaction, record);
    console.log(checkVote);
    if (checkVote == 'up') {
        interaction.reply({ content: 'Вы уже проголосовали ЗА.', ephemeral: true });
        return;
    }
    if (checkVote == 'down') {
        record.increment('up');
        record.decrement('down');
        adduser(record, interaction, 'up');
        editmessage(interaction);
        interaction.reply({ content: 'Вы изменили голос на ЗА.', ephemeral: true });
        return;
    }
    record.increment('up');
    adduser(record, interaction, 'up');
    editmessage(interaction);
    interaction.reply({ content: 'Ваш голос ЗА был оставлен!', ephemeral: true });
}

async function downvote(interaction) {
    const check = await checker(interaction);
    if (check == false) return;
    const record = await getRecord(interaction.message.id);
    const checkVote = await alreadyVote(interaction, record);
    if (checkVote == 'down') {
        interaction.reply({ content: 'Вы уже проголосовали против.', ephemeral: true });
        return;
    }
    if (checkVote == 'up') {
        record.increment('down');
        record.decrement('up');
        adduser(record, interaction, 'down');
        editmessage(interaction);
        interaction.reply({ content: 'Вы изменили голос на против.', ephemeral: true });
        return;
    }
    record.increment('down');
    adduser(record, interaction, 'down');
    editmessage(interaction);
    interaction.reply({ content: 'Ваш голос против был оставлен!', ephemeral: true });
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