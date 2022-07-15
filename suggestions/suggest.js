require('dotenv').config();
const { Info } = require('../utilities/logger.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { setupID, createRecord } = require('./database.js');

const votebutton = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId('upvotebutton')
        .setStyle('SUCCESS')
        .setEmoji('✅'),
    new MessageButton()
        .setCustomId('downvotebutton')
        .setStyle('DANGER')
        .setEmoji('🛑'),
);


let sugEmbed = new MessageEmbed();

module.exports = {

    async form(client, interaction) {
        const id = await setupID();
        Info('Отправка предложения с ID' + id);
        const desc = await interaction.fields.getTextInputValue('sug_desc');
        sugEmbed.setAuthor({ name: `Предложение от ${interaction.member.user.username}`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.webp` })
        .setTitle(interaction.fields.getTextInputValue('sug_topic'))
        .setColor('#fecc4e')
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
        const thismsg = await client.channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID).send({ embeds: [sugEmbed], components: [votebutton] });
        const jsonsugembed = JSON.stringify(sugEmbed);
        const objecttodb = {
            id,
            message: thismsg.id,
            content: jsonsugembed,
            owner: interaction.member.user.id,
        };
        createRecord(objecttodb);

        interaction.reply({ content: `Предложение отправлено успешно!\nЧтобы его удалить - напиши \`!удалить ${id}\` в любой канал.\nЧтобы его завершить - напиши \`!завершить ${id}\` в любой канал.`, ephemeral: true });
        sugEmbed = new MessageEmbed();
    },
};
