const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactrole')
        .setDescription('Reaction Roles')
        .addStringOption(option => option
            .setName('реакция')
            .setDescription('Вставьте реакцию, которую хотите использовать как кнопку для получения роли.')
            .setRequired(true))
        .addRoleOption(option => option
                .setName('роль')
                .setDescription('Выберите роль, которую вы хотите получить, нажав на реакцию.')
                .setRequired(true))
        .addStringOption(option => option
            .setName('id_сообщения')
            .setDescription('Вставьте ID сообщения, на которую бот поставит реакцию для получения роли.')
            .setRequired(true))
        .setDMPermission(false)
        .setDefaultMemberPermissions(0),
};