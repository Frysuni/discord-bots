import client from '@client';
import { Events, BaseInteraction, TextChannel } from 'discord.js';
import { removeRecordById } from '../database';

export const type = Events.InteractionCreate;

export async function execute(interaction: BaseInteraction) {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId != 'remove_react_role') return;

    const options = {
        removeReactions: false,
        removeRoles: false
    };

    if (interaction.values.includes('remove_reactions')) {
        const index = interaction.values.indexOf('remove_reactions');
        interaction.values.splice(index, 1);
        options.removeReactions = true;
    }
    if (interaction.values.includes('remove_roles')) {
        const index = interaction.values.indexOf('remove_roles');
        interaction.values.splice(index, 1);
        options.removeRoles = true;
    }
    if (interaction.values.length == 0) {
        interaction.reply({ ephemeral: true, content: 'Не выбрано ни одного объекта ReactRole, попробуй заново, раз ручки-крючки.' });
    }

    for (const id of interaction.values) {
        const reactRoleObject = await removeRecordById(id);

        if (options.removeReactions) {
            const channel = client.guilds.cache.first().channels.cache.get(reactRoleObject.channelId) as TextChannel;
            const message = (await channel.messages.fetch({ around: reactRoleObject.messageId })).get(reactRoleObject.messageId);

            if (message?.reactions?.cache?.size > 0) {
                message.reactions.cache.get(JSON.parse(reactRoleObject.emoji).content)?.remove();
            }
        }

        if (options.removeRoles) {
            const role = client.guilds.cache.first().roles.cache.get(reactRoleObject.roleId);
            role.members.forEach(member => {
                member.roles.remove(role);
            });
        }

        const channel = client.guilds.cache.first().channels.cache.get(reactRoleObject.channelId) as TextChannel;
        const message = (await channel.messages.fetch({ around: reactRoleObject.messageId })).get(reactRoleObject.messageId);

        if (message?.reactions?.cache?.size > 0) {
            const reaction = message.reactions.cache.get(JSON.parse(reactRoleObject.emoji).content);
            if (reaction.me) reaction.users.remove();
        }
    }

    interaction.update({ embeds: [], components: [], content: 'Я сделал все, что ты просил!' });

}