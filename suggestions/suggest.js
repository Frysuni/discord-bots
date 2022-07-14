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
        const desc = await interaction.fields.getTextInputValue('sug_desc');
        sugEmbed.setAuthor({ name: `Предложение от ${interaction.member.user.username}`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.webp` })
        .setTitle(interaction.fields.getTextInputValue('sug_topic'))
        .setColor('#fecc4e')
        .addFields(
            { name: '> **Название:**', value: interaction.fields.getTextInputValue('sug_name') }
        )
        .setFooter({text:`#${id}`});
        if (desc) {
            sugEmbed = {
                ...sugEmbed,
                fields: [
                    ...sugEmbed.fields,
                    { name: '> **Описание:**', value: desc, inline: false }
                ],
            };
        };
        const thismsg = await client.channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID).send({ embeds: [sugEmbed], components: [votebutton] });
        const jsonsugembed = JSON.stringify(sugEmbed)
        console.log(sugEmbed);
        objecttodb = {
            id,
            message: thismsg.id,
            content: jsonsugembed,
            owner: interaction.member.user.id,
        };
        createRecord(objecttodb);

        interaction.reply({ content: `Предложение отправлено успешно!\nЕсли захочешь его убрать - напиши \`!удалить ${id}\` в любой канал.`, ephemeral: true });
        sugEmbed = new MessageEmbed();
    }
};
