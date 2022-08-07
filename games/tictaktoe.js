const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');


/* --- Eventer --- */
module.exports = async (client) => {
    client.on('interactionCreate', (interaction) => EventInteractionCreate(client, interaction));
    client.on('messageCreate', (message) => EventMessageCreate(client, message));
};


/* --- Sub-Eventer --- */
async function EventInteractionCreate(client, interaction) {
    if (interaction.isCommand()) {
        if (interaction.commandName === 'tiktaktoe') {
            CallOpponent(client, interaction);
        }
    }
    else if (interaction.isButton()) {
        if (interaction.customId.startsWith('TikTakToe_CallButtonAgree')) {
            agreeButton(client, interaction);
        }
        else if (interaction.customId.startsWith('TikTakToe_CallButtonDecline')) {
            declineButton(interaction);
        }
    }
}


/* --- Databaser --- */
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './games/tiktaktoe.sqlite',
});

const DB_TikTakToe = sequelize.define('tiktaktoe', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    message: Sequelize.STRING(18),
    status: Sequelize.STRING(10),
    opponent: Sequelize.STRING(18),
    owner: Sequelize.STRING(18),
}, { timestamps: false });


async function EventMessageCreate(client, message) {
    if (message.content == 'сброс бд тиктакеков') {
        if (message.member.user.id != process.env.ADMIN_ID) {
            message.delete();
            return;
        }
        message.delete();
        DB_TikTakToe.sync();
    }
}
DB_TikTakToe.sync({ force: true });
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const setupID = async () => {
    let find;
    for (let ids = 1; ids != 200 ; ids++) {
        find = await DB_TikTakToe.findOne({ where: { id: ids } });
        if (find == null) {
            return ids;
        }
    }
};

let CallEmbed = new MessageEmbed();
/* --- Call Opponent --- */
async function CallOpponent(client, interaction) {
    const OpponentMember = await interaction.options.getUser('соперник');
    if (OpponentMember.id == interaction.member.user.id || OpponentMember.bot) {
        interaction.reply({ content: 'Я не дурак, и ты хуйней не занимайся.', ephemeral: true });
        return;
    }
    const RingID = await setupID();
    CallEmbed = {
        title: 'Игра: Крестики-нолики',
        color: 16698446,
        timestamp: Date.now(),
        fields: [
            {
                name: 'Ожидание ответа соперника',
                value: 'Осталось: `5 минут`',
                inline: false,
            },
        ],
        author: {
            name: `${interaction.member.user.username} вызывает на поединок ${OpponentMember.username} !`,
            iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.webp`,
        },
        footer: { text: '#' + RingID, iconURL: 'https://files.fryshost.ru/assets/Hopa.png' },
    };
    const CallButtons = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId('TikTakToe_CallButtonAgree/' + RingID)
            .setStyle('SUCCESS')
            .setEmoji('✅'),
        new MessageButton()
            .setCustomId('TikTakToe_CallButtonDecline/' + RingID)
            .setStyle('DANGER')
            .setEmoji('🛑'),
    );

    interaction.reply({ content: 'Запрос отправлен', ephemeral: true });
    const RingCallMessage = await client.channels.cache.get(interaction.channelId)
        .send({ content: `<@${OpponentMember.id}>, тебя вызывают на поединок!`, embeds: [CallEmbed], components: [CallButtons] });

    await DB_TikTakToe.create({
        id: RingID,
        status: 'waiting',
        message: RingCallMessage.id,
        opponent: OpponentMember.id,
        owner: interaction.member.user.id,
    });
    waitingAgree(RingID, RingCallMessage, interaction);

}

async function waitingAgree(RingID, RingCallMessage, interaction) {
    for (let i = 4; i != 0; i--) {
        await sleep(60000);
        const remained = i == 4 ? '4 минуты' : i == 3 ? '3 минуты' : i == 2 ? '2 минуты' : i == 1 ? '1 минута' : 'ты нашел пасхалку в коде, эта строка никогда не будет запущена, а тут она есть ;)';
        const TikTakToeRecord = await DB_TikTakToe.findOne({ where: { id: RingID } });
        if (TikTakToeRecord == null) {
            return;
        }
        if (await TikTakToeRecord.get('status') == 'waiting') {
            CallEmbed.fields[0].value = `Осталось: \`${remained}\``;
            const channel = interaction.client.channels.cache.get(interaction.channelId);
            channel.messages.fetch(RingCallMessage.id)
                .then(RingCallMsg => {
                    RingCallMsg.edit({ embeds: [CallEmbed] });
            });
        }
        else { return; }
    }
    CallEmbed.fields[0] = { name: 'Время вышло.', value: 'Cоперник не ответил на запрос.', inline: false };
    const channel = interaction.client.channels.cache.get(interaction.channelId);
            channel.messages.fetch(RingCallMessage.id)
                .then(RingCallMsg => {
                    RingCallMsg.edit({ embeds: [CallEmbed], components: [] });
            });
    DB_TikTakToe.destroy({ where: { id: RingID } });
}


/* const OneOne_TikTakToeButton = new MessageButton();
const OneTwo_TikTakToeButton = new MessageButton();
const OneThree_TikTakToeButton = new MessageButton();
const TwoOne_TikTakToeButton = new MessageButton();
const TwoTwo_TikTakToeButton = new MessageButton();
const TwoThree_TikTakToeButton = new MessageButton();
const ThreeOne_TikTakToeButton = new MessageButton();
const ThreeTwo_TikTakToeButton = new MessageButton();
const ThreeThree_TikTakToeButton = new MessageButton();*/
let TikTakToeEmbed = new MessageEmbed();
async function agreeButton(client, interaction) {
    const ButtonIdSplitted = interaction.customId.split('/');
    const RingID = ButtonIdSplitted[1];
    const TikTakToeRecord = await DB_TikTakToe.findOne({ where: { id: RingID } });
    const OpponentID = await TikTakToeRecord.get('opponent');
    const OwnerID = await TikTakToeRecord.get('owner');
    if (interaction.member.user.id != OpponentID) {
        interaction.reply({ content: `Только <@${OpponentID}> может принять приглашение.`, ephemeral: true });
        return;
    }
    else {
        CallEmbed = new MessageEmbed();
        const RingCallMessageId = await TikTakToeRecord.get('message');
        DB_TikTakToe.update({ status: 'playing' }, { where: { id: RingID } });
        const OwnerMember = await client.users.fetch(OwnerID);
        TikTakToeEmbed = {
            title: 'Игра: Крестики-нолики',
            color: 16698446,
            timestamp: Date.now(),
            fields: [
                {
                    name: 'Стороны:',
                    value: `:x: **-** <@${OwnerID}>`,
                    inline: true,
                },
                {
                    name: '\u200B',
                    value: `:o: **-** <@${interaction.member.user.id}>`,
                    inline: true,
                },
            ],
            author: {
                name: `${OwnerMember.username} против ${interaction.member.user.username} !`,
                iconURL: 'https://files.fryshost.ru/assets/Hopa.png',
            },
            footer: { text: '#' + RingID, iconURL: 'https://files.fryshost.ru/assets/Hopa.png' },
        };


        const channel = interaction.client.channels.cache.get(interaction.channelId);
        channel.messages.fetch(RingCallMessageId)
            .then(RingCallMsg => {
                RingCallMsg.edit({ embeds: [TikTakToeEmbed], components: [] });
        });
    }
}
async function declineButton(interaction) {
    const ButtonIdSplitted = interaction.customId.split('/');
    const RingID = ButtonIdSplitted[1];
    const TikTakToeRecord = await DB_TikTakToe.findOne({ where: { id: RingID } });
    const RingCallMessageId = await TikTakToeRecord.get('message');
    if (interaction.member.user.id == await TikTakToeRecord.get('owner') || interaction.member.user.id == await TikTakToeRecord.get('opponent')) {
        interaction.deferUpdate();

        CallEmbed.fields[0] = { name: 'Запрос отклонен.', value: `<@${interaction.member.user.id}> отклонил приглашение.`, inline: false };
        const channel = interaction.client.channels.cache.get(interaction.channelId);
            channel.messages.fetch(RingCallMessageId)
                .then(RingCallMsg => {
                    RingCallMsg.edit({ embeds: [CallEmbed], components: [] });
            });
        DB_TikTakToe.destroy({ where: { id: RingID } });
    }
    else {
        interaction.reply({ content: 'Ты не связан с этим поединком. Можешь создать новый командой /tiktaktoe', ephemeral: true });
    }
}