const { MessageActionRow, Modal, TextInputComponent } = require('discord.js');

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

module.exports = { 
    async writebutton(client, interaction) {
        interaction.showModal(suggest);
    },
}