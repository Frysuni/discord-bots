require('dotenv').config();
const { MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent } = require('discord.js');
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

module.exports =  {

    async form(client, interaction) {
        const id = await setupID();
        sugEmbed.setAuthor({ name: `Предложение от ${interaction.member.user.username}`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.webp` })
        .setTitle(interaction.fields.getTextInputValue('sug_topic'))
        .setColor('#fecc4e')
        .addFields(
            { name: '> **Название:**', value: interaction.fields.getTextInputValue('sug_name') },
            { name: '> **Описание:**', value: interaction.fields.getTextInputValue('sug_desc') },
        )
        .setFooter({text:`#${id}`});

        const thismsg = await client.channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID).send({ embeds: [sugEmbed], components: [votebutton] });
        objecttodb = {
            id,
            message: thismsg.id,
            content: thismsg.embeds.MessageEmbed,
            up: 0,
            down: 0,
            owner: interaction.member.user.id,
        };
        createRecord(objecttodb);

        interaction.reply({ content: `Предложение отправлено успешно!\nЕсли захочешь его убрать - напиши \`!удалить ${id}\` в любой канал.`, ephemeral: true });
        sugEmbed = new MessageEmbed();
    }
};
