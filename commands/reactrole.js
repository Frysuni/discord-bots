const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactrole')
        .setDescription('Reaction Roles на максималках')
        .addStringOption(option => option
            .setName('idреакции')
            .setDescription('Вставьте ID реакции, которую хотите использовать как кнопку для получения роли.')
            .setRequired(true))
        .addRoleOption(option => option
            .setName('роль')
            .setDescription('Выберите роль, которую вы хотите получить, нажав на реакцию.')
            .setRequired(true))
        .addStringOption(option => option
            .setName('idсообщения')
            .setDescription('Вставьте ID сообщения, на которую бот поставит реакцию для получения роли.')
            .setRequired(true))
        .setDMPermission(false)
        .setDefaultMemberPermissions(0),

    async reactrole(interaction) {
        await interaction.reply({ content: 'Нет! Еще недоступно! Система ожидается в версии 1.3.x', ephemeral: true });
    },
};