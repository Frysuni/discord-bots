const { logger } = require('../utilities/logger.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { setupID, createRecord } = require('./database.js');

const votebuttons = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId('upvotebutton')
        .setStyle('SUCCESS')
        .setEmoji('✅'),
    new MessageButton()
        .setCustomId('downvotebutton')
        .setStyle('DANGER')
        .setEmoji('🛑'),
);
const workbuttons = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId('sug_finish')
        .setStyle('PRIMARY')
        .setEmoji('🏁'),
    new MessageButton()
        .setCustomId('sug_remove')
        .setStyle('SECONDARY')
        .setEmoji('🗑'),
);

const isValidUrl = async urlString => {
    const urlPattern = new RegExp('^(https?:\\/\\/)?'
        + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'
        + '((\\d{1,3}\\.){3}\\d{1,3}))'
        + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'
        + '(\\?[;&a-z\\d%_.~+=-]*)?'
        + '(\\#[-a-z\\d_]*)?$', 'i');
    return !!urlPattern.test(urlString);
};
module.exports = {

    async form(client, interaction) {
        const id = await setupID();
        logger('Отправка предложения с ID ' + id);
        const desc = await interaction.fields.getTextInputValue('sug_desc');
        const image_url = await interaction.fields.getTextInputValue('sug_image_url');
        let sugEmbed = new MessageEmbed()
        .setAuthor({ name: `Предложение от ${interaction.member.user.username}`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.webp` })
        .setTitle(interaction.fields.getTextInputValue('sug_topic'))
        .addFields(
            { name: '> **Название:**', value: interaction.fields.getTextInputValue('sug_name') },
        )
        .setFooter({ text:`#${id}` });
        if (desc) {
            sugEmbed = {
                ...sugEmbed,
                fields: [
                    ...sugEmbed.fields,
                    { name: '> **Описание:**', value: desc, inline: false },
                ],
            };
        }
        if (image_url) {
            if (!await isValidUrl(image_url)) {
                logger('Невалидная ссылка в модалке ' + image_url);
                interaction.reply({ content: 'Ты указал ссылку, которая не прошла проверку на валидность. К сожалению, ошибку я могу обработать только вылетом всплывающего окна, чтобы бот не крашнулся. Так что извини, придется переписать. В теории, я могу дописать функционал восстановления набранного текста, если попросишь. Но пока только так.', ephemeral: true });
                return;
            }
            sugEmbed = {
                ...sugEmbed,
                'image': { 'url': image_url },
            };
        }
        const thismsg = await client.channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID).send({ content: ':grey_exclamation: **Новое предложение!**', embeds: [sugEmbed], components: [votebuttons, workbuttons] });
        const objecttodb = {
            id,
            message: thismsg.id,
            content: JSON.stringify(sugEmbed),
            owner: interaction.member.user.id,
        };
        createRecord(objecttodb);

        interaction.reply({ content: 'Предложение отправлено успешно!', ephemeral: true });
        sugEmbed = new MessageEmbed();
    },
};
