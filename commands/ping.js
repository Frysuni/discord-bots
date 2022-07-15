const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Не, ну это легенда'),
    async ping(interaction) {
        const sent = await interaction.reply({ content: 'Замер пинга...', fetchReply: true, ephemeral: true });
        interaction.editReply(`Пинг: ${sent.createdTimestamp - interaction.createdTimestamp}мс`);
    },
};