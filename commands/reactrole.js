const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactrole')
        .setDescription('Reaction Roles')
        .addStringOption(option => option
            .setName('id_реакции')
            .setDescription('Вставьте ID реакции, которую хотите использовать как кнопку для получения роли.')
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

    reactrole(client, interaction) {
        const ReactionID = interaction.options.getString('id_реакции');
        const Role = interaction.options.getRole('роль');
        const MessageID = interaction.options.getString('id_сообщения');
        interaction.reply({ content: 'Стой! Этого еще нет, так что дальнейшие операции заблокированы во избежании крашей. Короче.. блять да там сложно!!!', ephemeral: true });

        console.log(`${ReactionID} ${Role} ${MessageID}`);
    },
};