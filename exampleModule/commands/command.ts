import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('my_command')
    .setNameLocalization('ru', 'моя_комманда')

    .setDescription('Which does nothing.')
    .setDescriptionLocalization('ru', 'Которая ничего не делает.')

    .setDMPermission(false);

export const execute = async (interaction: ChatInputCommandInteraction) => {
    console.log(interaction);
};