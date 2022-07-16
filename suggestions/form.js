const { logger } = require('../utilities/logger.js');
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
    .setPlaceholder('Что хотите предложить?')
    .setRequired(true);
const sug_desc = new TextInputComponent()
    .setCustomId('sug_desc')
    .setLabel('Развернутое описание')
    .setStyle('PARAGRAPH')
    .setPlaceholder('*необязательно*');
const sug_image_url = new TextInputComponent()
    .setCustomId('sug_image_url')
    .setLabel('Ссылка на картинку')
    .setStyle('SHORT')
    .setPlaceholder('https://cdn.discordapp.com/attachments...');

const sug_topicRow = new MessageActionRow().addComponents(sug_topic);
const sug_nameRow = new MessageActionRow().addComponents(sug_name);
const sug_descRow = new MessageActionRow().addComponents(sug_desc);
const sug_image_urlRow = new MessageActionRow().addComponents(sug_image_url);
suggest.addComponents(sug_topicRow, sug_nameRow, sug_descRow, sug_image_urlRow);

module.exports = {
    async writebutton(interaction) {
        logger('Модалка предложения открыта.');
        interaction.showModal(suggest);
    },
};