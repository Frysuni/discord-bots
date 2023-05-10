import { PermissionFlagsBits, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import addReactRole from '../addReactRole';
import removeReactRole from '../removeReactRole/removeReactRole';

export const data = new SlashCommandBuilder()
    .setName('reactrole')
    .setNameLocalization('ru', 'реакт_роль')
    .setDescription('Хуйхуйхуй.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageWebhooks)

    .addSubcommand(typeAdd => typeAdd
        .setName('add')
        .setNameLocalization('ru', 'добавить')

        .setDescription('Добавить роль по реакциям к сообщению.')

        .addRoleOption(role => role
            .setName('role')
            .setNameLocalization('ru', 'роль')
            .setDescription('Выберите роль, которую должен получить участник, нажав на реакцию.')
            .setRequired(true))

        .addStringOption(emoji => emoji
            .setName('emoji')
            .setNameLocalization('ru', 'эмодзи')
            .setDescription('Эмодзи для реакции')
            .setRequired(true))

        .addStringOption(messageId => messageId
            .setName('message_id')
            .setNameLocalization('ru', 'id_сообщения')
            .setDescription('Вставь сюда ID сообщения, ну ты понял короче.')
            .setRequired(true)))

    .addSubcommand(typeRemove => typeRemove
        .setName('remove')
        .setNameLocalization('ru', 'удалить')
        .setDescription('Удалить реактроль.'));


export async function execute(interaction: ChatInputCommandInteraction) {
    const type = interaction.options.getSubcommand();

    if (type == 'add') addReactRole(interaction);
    if (type == 'remove') removeReactRole(interaction);
}