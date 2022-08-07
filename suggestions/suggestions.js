const { MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent } = require('discord.js');


/* --- Eventer --- */
module.exports = async (client) => {
    client.on('interactionCreate', (interaction) => EventInteractionCreate(client, interaction));
    client.on('messageCreate', (message) => EventMessageCreate(client, message));
};

/* --- Sub-Eventer --- */
async function EventInteractionCreate(client, interaction) {
    if (interaction.isButton()) {
		if (interaction.customId === 'ButtonWriteNewSuggestion') {
            interaction.showModal(ModalForm);
        }
        else if (interaction.customId === 'SuggestionUpVoteButton') {
            Suggestion_UpVote(interaction);
        }
        else if (interaction.customId === 'SuggestionDownVoteButton') {
            Suggestion_DownVote(interaction);
        }
        else if (interaction.customId === 'CallControlPanel') {
            SuggestionControlPanel(interaction);
        }
        else if (interaction.customId.startsWith('Suggestions_FinishUp')) {
            FinishSuggestion(interaction, true);
        }
        else if (interaction.customId.startsWith('Suggestions_FinishDown')) {
            FinishSuggestion(interaction, false);
        }
        else if (interaction.customId.startsWith('Suggestions_Pin')) {
            PinSuggestion(interaction, false);
        }
        else if (interaction.customId.startsWith('Suggestions_Delete')) {
            DeleteSuggestion(interaction);
        }
	}
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'ModalForm') {
            SendSuggestion(client, interaction);
        }
    }
}

async function EventMessageCreate(client, message) {

    if (message.content === process.env.SUGGESTIONS_TRIGGER && message.member.user.id == process.env.ADMIN_ID) {
        FirstMessageSend(client, message);
    }
}


/* --- Databaser--- */
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './suggestions/suggestions.sqlite',
});

const DB_Suggestions = sequelize.define('suggestions', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    message: Sequelize.STRING(18),
    content: Sequelize.STRING(10000),
    up: Sequelize.INTEGER,
    down: Sequelize.INTEGER,
    users: Sequelize.STRING(10000),
    owner: Sequelize.STRING(18),
}, { timestamps: false });

/* --- First Message --- */
const FirstMessageEmbed = new MessageEmbed()
	.setColor('#fecc4e')
	.setTitle('Есть идеи? Предложи их тут!')
	.setDescription('В этом канале создаются новые предложения касательно Норы. Постарайтесь описать ваше предложение более подробно, чтобы не возникало лишних вопросов.')
	.addFields(
		{ name: '\u200B', value: '> Для того, чтобы оставить предложение, нажмите кнопку ниже и заполните всплывающую форму.' },
        { name: '\u200B', value: '> Голосовать за Ваше предложение сможет любой `@Участник` Норы, нажав соответсвующую кнопку под вашим предложением.' },
        { name: '\u200B', value: '> Версия: БЕТА-2.0.0.\nВозможны ошибки в работе, обязательно сообщайте <@920753536608899092> о любых проблемах.' },
	);

const ButtonWriteNewSuggestion = new MessageActionRow()
    .addComponents(new MessageButton()
        .setCustomId('ButtonWriteNewSuggestion')
        .setLabel('Написать')
        .setStyle('PRIMARY')
        .setEmoji('📨'),
);

async function FirstMessageSend(client, message) {
    const Suggestions_Channel = client.channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID);
    message.delete();
    const FetchedMessages = await Suggestions_Channel.messages.fetch({ limit: 99 });
    await Suggestions_Channel.bulkDelete(FetchedMessages, true).then(
        Suggestions_Channel.send({ embeds: [FirstMessageEmbed], components: [ButtonWriteNewSuggestion] }));
    DB_Suggestions.sync({ force: true });
}


/* --- Modal Form --- */
const ModalForm = new Modal()
	.setCustomId('ModalForm')
	.setTitle('Создать новое предложение');

const Suggestion_Topic = new TextInputComponent()
    .setCustomId('Suggestion_Topic')
    .setLabel('К чему относится предложение?')
    .setStyle('SHORT')
    .setPlaceholder('Например: Бот, Сервер, Ивент')
    .setMaxLength('32')
    .setRequired(true);
const Suggestion_Name = new TextInputComponent()
    .setCustomId('Suggestion_Name')
    .setLabel('Краткое название идеи')
    .setStyle('SHORT')
    .setPlaceholder('Что хотите предложить?')
    .setMaxLength(256)
    .setRequired(true);
const Suggestion_Description = new TextInputComponent()
    .setCustomId('Suggestion_Description')
    .setLabel('Развернутое описание')
    .setStyle('PARAGRAPH')
    .setMaxLength(1024);
const Suggestion_ImageURL = new TextInputComponent()
    .setCustomId('Suggestion_ImageURL')
    .setLabel('Ссылка на картинку')
    .setStyle('SHORT')
    .setMaxLength(1024)
    .setPlaceholder('https://cdn.discordapp.com/attachments...');

ModalForm.addComponents(
    new MessageActionRow().addComponents(Suggestion_Topic),
    new MessageActionRow().addComponents(Suggestion_Name),
    new MessageActionRow().addComponents(Suggestion_Description),
    new MessageActionRow().addComponents(Suggestion_ImageURL),
);


/* --- Suggestion --- */

const SuggestionsButtons = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId('SuggestionUpVoteButton')
        .setStyle('SUCCESS')
        .setEmoji('✅'),
    new MessageButton()
        .setCustomId('SuggestionDownVoteButton')
        .setStyle('DANGER')
        .setEmoji('🛑'),
    new MessageButton()
        .setCustomId('CallControlPanel')
        .setStyle('SECONDARY')
        .setEmoji('🛠'),
);
const setupID = async () => {
    let find;
    for (let ids = 1; ids != 200 ; ids++) {
        find = await DB_Suggestions.findOne({ where: { id: ids } });
        if (find == null) {
            return ids;
        }
    }
};
const isValidUrl = async urlString => {
    const urlPattern = new RegExp('^(https?:\\/\\/)?'
        + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'
        + '((\\d{1,3}\\.){3}\\d{1,3}))'
        + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'
        + '(\\?[;&a-z\\d%_.~+=-]*)?'
        + '(\\#[-a-z\\d_]*)?$', 'i');
    return !!urlPattern.test(urlString);
};
async function SendSuggestion(client, interaction) {
    const id = await setupID();
    const description = interaction.fields.getTextInputValue('Suggestion_Description');
    const image_url = interaction.fields.getTextInputValue('Suggestion_ImageURL');
    let SuggestionEmbed = new MessageEmbed()
        .setAuthor({ name: `Предложение от ${interaction.member.user.username}`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.webp` })
        .setTitle(interaction.fields.getTextInputValue('Suggestion_Topic'))
        .setTimestamp()
        .setFooter({ text:`#${id}` });
    SuggestionEmbed = {
        ...SuggestionEmbed,
        fields: [
            { name: interaction.fields.getTextInputValue('Suggestion_Name'),
              value: description ? description : '\u200B', inline: false },
        ],
    };
    if (image_url) {
        if (!await isValidUrl(image_url)) {
            interaction.reply({ content: `Ты указал ссылку, которая не прошла проверку на валидность. Предложение не будет отправляться, чтобы ты все проверил сам.\nВот тебе восстановленный текст:\nTitle - ${interaction.fields.getTextInputValue('Suggestion_Topic')}\nName - ${interaction.fields.getTextInputValue('Suggestion_Name')}\nDescription - ${interaction.fields.getTextInputValue('Suggestion_Description')}\nСинтасически невалидная ссылка - ${interaction.fields.getTextInputValue('Suggestion_ImageURL')}`, ephemeral: true });
            return;
        }
        SuggestionEmbed = {
            ...SuggestionEmbed,
            'image': { 'url': image_url },
        };
    }
    const SuggestionMessage = await client.channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID)
        .send({ content: ':grey_exclamation: **Новое предложение!**', embeds: [SuggestionEmbed], components: [SuggestionsButtons] });
    await DB_Suggestions.create({
        id,
        message: SuggestionMessage.id,
        content: JSON.stringify(SuggestionEmbed),
        up: 0,
        down: 0,
        owner: interaction.member.user.id,
    });

    interaction.deferUpdate();
}

/* --- Sussestion Vote --- */
async function UsersListing(MessageID) {
    const SuggestionRecord = await DB_Suggestions.findOne({ where: { message: MessageID } });
    const UsersDB = JSON.parse(await SuggestionRecord.get('users'));
    const UsersArray = Object.keys(UsersDB);
    let UsersList = '';
    for (let i = UsersArray.length - 1; i >= 0; --i) {
        if (i === 0) {
            UsersList += ` <@${UsersArray[i]}>.`;
        }
        else if (i === (UsersArray.length - 1)) {
            UsersList += `<@${UsersArray[i]}>,`;
        }
        else {
            UsersList += ` <@${UsersArray[i]}>,`;
        }
    }
    return UsersList;

}
async function AddUserToDB(SuggestionRecord, interaction, hisVote) {
    let UsersDB = JSON.parse(await SuggestionRecord.get('users'));
    const NewUserID = interaction.member.user.id;
    if (!UsersDB) {
        UsersDB = {};
        UsersDB[NewUserID] = hisVote;
    }
    else {
        UsersDB[NewUserID] = hisVote;
    }

    const UsersString = JSON.stringify(UsersDB);
    DB_Suggestions.update({ users: UsersString }, { where: { message: interaction.message.id } });
}
async function EditSuggestionMessage(interaction) {
    const SuggestionRecord = await DB_Suggestions.findOne({ where: { message: interaction.message.id } });
    const SuggestionEmbed = JSON.parse(await SuggestionRecord.get('content'));
    const UpVotes = await SuggestionRecord.get('up');
    const DownVotes = await SuggestionRecord.get('down');
    const newembed = {
        ...SuggestionEmbed,
        fields: [
            ...SuggestionEmbed.fields,
            { name: `✅** - ${UpVotes}**`, value: `🛑** - ${DownVotes}**`, inline: false },
            { name: 'Уже проголосовали:', value: await UsersListing(interaction.message.id), inline: false },
        ],
        color: (UpVotes > DownVotes) ? 2981190 : (UpVotes === DownVotes) ? 16698446 : 14171198,
    };
    const channel = interaction.client.channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID);
    channel.messages.fetch(interaction.message.id)
        .then(message => {
            message.edit({ content: '\u200B', embeds: [newembed] });
        });
}

async function alreadyVoted(interaction, SuggestionEmbed) {
    const UsersDB = JSON.parse(await SuggestionEmbed.get('users'));
    if (!UsersDB) return false;
    if (UsersDB[interaction.member.user.id] == 'up') return 'up';
    if (UsersDB[interaction.member.user.id] == 'down') return 'down';
    return false;
}

async function Suggestion_UpVote(interaction) {
    const SuggestionRecord = await DB_Suggestions.findOne({ where: { message: interaction.message.id } });
    if (interaction.member.user.id == await SuggestionRecord.get('owner')) {
        interaction.reply({ content: 'Ты создал это предложение, ты не можешь за него голосовать.', ephemeral: true });
        return;
    }
    const checkVote = await alreadyVoted(interaction, SuggestionRecord);
    if (checkVote == 'up') {
        interaction.reply({ content: 'Вы уже проголосовали ЗА.', ephemeral: true });
        return;
    }
    if (checkVote == 'down') {
        SuggestionRecord.increment('up');
        SuggestionRecord.decrement('down');
        AddUserToDB(SuggestionRecord, interaction, 'up');
        EditSuggestionMessage(interaction);
        interaction.deferUpdate();
        return;
    }
    SuggestionRecord.increment('up');
    AddUserToDB(SuggestionRecord, interaction, 'up');
    EditSuggestionMessage(interaction);
    interaction.deferUpdate();
}
async function Suggestion_DownVote(interaction) {
    const SuggestionRecord = await DB_Suggestions.findOne({ where: { message: interaction.message.id } });
    if (interaction.member.user.id == await SuggestionRecord.get('owner')) {
        interaction.reply({ content: 'Ты создал это предложение, ты не можешь за него голосовать.', ephemeral: true });
        return;
    }
    const checkVote = await alreadyVoted(interaction, SuggestionRecord);
    if (checkVote == 'down') {
        interaction.reply({ content: 'Вы уже проголосовали ПРОТИВ.', ephemeral: true });
        return;
    }
    if (checkVote == 'up') {
        SuggestionRecord.increment('down');
        SuggestionRecord.decrement('up');
        AddUserToDB(SuggestionRecord, interaction, 'down');
        EditSuggestionMessage(interaction);
        interaction.deferUpdate();
        return;
    }
    SuggestionRecord.increment('down');
    AddUserToDB(SuggestionRecord, interaction, 'down');
    EditSuggestionMessage(interaction);
    interaction.deferUpdate();
}


/* --- Control Panel --- */
async function setControlButtons(id) {
    id = '/' + id;
    const ControlButtons = {
        FinishUp: new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('Suggestions_FinishUp' + id)
                .setStyle('SUCCESS')
                .setLabel('Завершить в пользу предложения')
                .setEmoji('🏁'),
        ),
        FinishDown: new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('Suggestions_FinishDown' + id)
                .setStyle('DANGER')
                .setLabel('Завершить против предложения')
                .setEmoji('🏁'),
        ),
        Pin: new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('Suggestions_Pin' + id)
                .setStyle('PRIMARY')
                .setLabel('Закрепить/открепить предложение')
                .setEmoji('📌'),
        ),
        Delete: new MessageActionRow().addComponents(
           new MessageButton()
                .setCustomId('Suggestions_Delete' + id)
                .setStyle('SECONDARY')
                .setLabel('Удалить предложение')
                .setEmoji('🗑'),
        ),
    };
    return ControlButtons;
}
async function SuggestionControlPanel(interaction) {
    let ControlPanelEmbed = new MessageEmbed()
        .setTitle('🛠 Панель управления предложением')
        .setFooter({ text: 'Удаление предложения - безвозвратное действие.', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Info_Simple_bw.svg/1200px-Info_Simple_bw.svg.png' })
        .setColor(16698446);

    const SuggestionRecord = await DB_Suggestions.findOne({ where: { message: interaction.message.id } });
    if (!interaction.member.permissions.has('ADMINISTRATOR')
        && interaction.member.user.id != (await SuggestionRecord.get('owner'))
        && interaction.member.user.id != process.env.ADMIN_ID)
        {
        interaction.reply({ content: 'Вы не можете управлять чужим предложением.', ephemeral: true });
        return;
    }
    const id = await SuggestionRecord.get('id');
    const content = JSON.parse(await SuggestionRecord.get('content'));
    ControlPanelEmbed = {
        ...ControlPanelEmbed,
        fields: [
            { name: `Управление предложением #${id}`, value:`"${content.fields[0].name}"` },
        ],
    };
    const ControlButtons = await setControlButtons(id);
    interaction.reply({ embeds: [ControlPanelEmbed],
        components: [
            ControlButtons.FinishUp,
            ControlButtons.FinishDown,
            ControlButtons.Pin,
            ControlButtons.Delete,
        ], ephemeral: true });
}

/* --- Finish --- */

async function FinishSuggestion(interaction, CloseValue) {
    const ButtonIdSplitted = interaction.customId.split('/');
    const SuggestionID = ButtonIdSplitted[1];
    const SuggestionRecord = await DB_Suggestions.findOne({ where: { id: SuggestionID } });
    if (SuggestionRecord == null) {
        interaction.reply({ content: 'Предложение удалено, конченный.', ephemeral: true });
        return;
    }
    const UpVotes = await SuggestionRecord.get('up');
    const DownVotes = await SuggestionRecord.get('down');
    if (UpVotes == '0' && DownVotes == '0') {
        interaction.reply({ content: 'За это предложение еще никто не голосовал, ты можешь только удалить его.', ephemeral: true });
        return;
    }
    let SuggestionEmbed = JSON.parse(await SuggestionRecord.get('content'));
    const SuggestionMessageID = await SuggestionRecord.get('message');

    const ResName = CloseValue ? 'В пользу предложения ✅' : 'Против предложения 🛑';
    const ResColor = CloseValue ? 2981190 : 14171198;
    const ifIllegal = (CloseValue != (UpVotes > DownVotes)) ? '(Несмотря на результат голосования)' : '\u200B';

    SuggestionEmbed.fields[0].value = '\u200B';
    SuggestionEmbed = {
        ...SuggestionEmbed,
        fields: [
            ...SuggestionEmbed.fields,
            { name: 'Голосование завершено со счетом:', value: `✅** - ${UpVotes}** 🛑** - ${DownVotes}**`, inline: false },
            { name: ResName, value: ifIllegal, inline: false },
        ],
        color: ResColor,
        image: null,
    };

    const DeleteButton = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId('Suggestions_Delete/' + SuggestionID)
            .setLabel('Удалить')
            .setStyle('SECONDARY')
            .setEmoji('🗑'),
    );

    const channel = interaction.client.channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID);
    channel.messages.fetch(SuggestionMessageID)
        .then(SuggestionMessage => {
            SuggestionMessage.edit({ embeds: [SuggestionEmbed], components: [DeleteButton] });
    });
    interaction.deferUpdate();
}
async function PinSuggestion(interaction) {
    const ButtonIdSplitted = interaction.customId.split('/');
    const SuggestionID = ButtonIdSplitted[1];
    const SuggestionRecord = await DB_Suggestions.findOne({ where: { id: SuggestionID } });
    if (SuggestionRecord == null) {
        interaction.reply({ content: 'Предложение удалено, конченный, че ты тыкаешь блять.', ephemeral: true });
        return;
    }
    const SuggestionMessageID = SuggestionRecord.get('message');
    const channel = interaction.client.channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID);
    const SuggestionMessage = await channel.messages.fetch(SuggestionMessageID);
    if (SuggestionMessage.pinned) {
        SuggestionMessage.unpin();
        interaction.deferUpdate();
    }
    else {
        SuggestionMessage.pin().then(() =>
            setTimeout(() => {
                channel.bulkDelete(1);
            }, 1000),
        );
        interaction.deferUpdate();
    }
}

/* --- Delete --- */

async function DeleteSuggestion(interaction) {
    const ButtonIdSplitted = interaction.customId.split('/');
    const SuggestionID = ButtonIdSplitted[1];
    const SuggestionRecord = await DB_Suggestions.findOne({ where: { id: SuggestionID } });
    if (SuggestionRecord == null) {
        interaction.reply({ content: 'Предложение удалено, конченный, че ты тыкаешь блять.', ephemeral: true });
        return;
    }
    const SuggestionMessageID = SuggestionRecord.get('message');
    const channel = interaction.client.channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID);
    const SuggestionMessage = await channel.messages.fetch(SuggestionMessageID);
    SuggestionMessage.delete();
    DB_Suggestions.destroy({ where: { id: SuggestionID } });
    interaction.deferUpdate();
}