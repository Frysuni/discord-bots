const { Info } = require('../utilities/logger.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Не, ну это легенда'),
    async ping(interaction) {
        Info('/ping вызвано. ' + interaction.member.user.username);
        const sent = await interaction.reply({ content: 'Замер пинга...', fetchReply: true, ephemeral: true });
        interaction.editReply(`Пинг: ${sent.createdTimestamp - interaction.createdTimestamp}мс`);
    },
};