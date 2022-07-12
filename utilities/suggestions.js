require('dotenv').config();
const { suggestions } = require('../database/worker.js')
const { MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent } = require('discord.js');

const startEmbed = new MessageEmbed()
	.setColor('#fecc4e')
	.setTitle('Есть идеи? Предложи их тут!')
	.setDescription('В этом канале создаются новые предложения касательно Норы. Постарайтесь описать ваше предложение более подробно, чтобы не возникало лишних вопросов.')
	.addFields(
		{ name: '\u200B', value: '> Для того, чтобы оставить предложение, нажмите кнопку ниже и заполните всплывающую форму.' },
        { name: '\u200B', value: '> Голосовать за Ваше предложение сможет любой `@Участник` Норы, нажав соответсвующую кнопку под вашим предложением.' },
	);

const write = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId('write')
        .setLabel('Написать')
        .setStyle('PRIMARY')
        .setEmoji('📨'),
);


const suggest = new Modal()
	.setCustomId('suggest')
	.setTitle('Создать новое предложение');
const sug_topic = new TextInputComponent()
    .setCustomId('sug_topic')
    .setLabel('К чему относится предложение?')
    .setStyle('SHORT')
    .setPlaceholder('Например: Бот, Сервер, Ивент')
    .setRequired(true);
const sug_name = new TextInputComponent()
    .setCustomId('sug_name')
    .setLabel('Краткое название идеи')
    .setStyle('SHORT')
    .setPlaceholder('Реализовать Reaction Roles')
    .setRequired(true);
const sug_desc = new TextInputComponent()
    .setCustomId('sug_desc')
    .setLabel("Развернутое описание")
    .setStyle('PARAGRAPH');
const sug_topicRow = new MessageActionRow().addComponents(sug_topic);
const sug_nameRow = new MessageActionRow().addComponents(sug_name);
const sug_descRow = new MessageActionRow().addComponents(sug_desc);
suggest.addComponents(sug_topicRow, sug_nameRow, sug_descRow);

let sugEmbed = new MessageEmbed()

module.exports =  {
    async start(client, message) {
        client.channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID).send({ embeds: [startEmbed], components: [write] });
        message.delete();
    },

    async button(client, interaction) {
        if (interaction.customId === 'write') {
            await interaction.showModal(suggest);
        }
    },

    async form(client, interaction) {

        sugEmbed.setAuthor({ name: `Предложение от ${interaction.member.user.username}`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.webp` })
        .setTitle(interaction.fields.getTextInputValue('sug_topic'))
        .setColor('#fecc4e')
        .addFields(
            { name: '> **Название:**', value: interaction.fields.getTextInputValue('sug_name') },
            { name: '> **Описание:**', value: interaction.fields.getTextInputValue('sug_desc') },
        );
        client.channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID).send({ embeds: [sugEmbed] });
        sugEmbed = new MessageEmbed();
    }
};
