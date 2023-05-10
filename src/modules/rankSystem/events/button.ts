import { Events, ButtonInteraction } from 'discord.js';
import { pagingLeaders } from '../commands/leaders';

export const type = Events.InteractionCreate;

export const execute = async (interaction: ButtonInteraction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId != 'nextpage' && interaction.customId != 'prevpage') return;

    pagingLeaders(interaction);
};