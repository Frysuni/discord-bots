const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tiktaktoe')
        .setDescription('Крестики-нолики!')
        .addUserOption(option => option
            .setName('соперник')
            .setDescription('Выберите участника, чтобы вызвать его на поединок!')
            .setRequired(true)),
};