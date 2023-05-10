import { ButtonInteraction, Events, MessageEditOptions } from 'discord.js';
import { musicControlReply, musicPlayer, queueReply } from '..';

export const type = Events.InteractionCreate;

const ids = ['pause', 'unpause', 'skip', 'stop', 'queue'];
export async function execute(interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;
    if (!ids.includes(interaction.customId)) return;

    const memberVoice = interaction.guild.members.cache.get(interaction.user.id).voice?.channel;
    if (!memberVoice || musicPlayer.voiceChannel?.id != memberVoice.id) {
        interaction.reply({ ephemeral: true, content: 'Вы не находитесь в одном канале с ботом.' });
        return;
    }

    if (!interaction.message.editable) {
        interaction.reply({ ephemeral: true, content: 'Сообщение устарело, пожалуйста, воспользуйтесь командой `/музыка панель` повторно.' });
        return;
    }

    if (interaction.customId == 'pause') {
        musicPlayer.pause();
        interaction.message.edit(musicControlReply() as MessageEditOptions);
        interaction.reply(`${interaction.user.username} поставил музыку на паузу.`);
        return;
    }
    if (interaction.customId == 'unpause') {
        musicPlayer.unpause();
        interaction.message.edit(musicControlReply() as MessageEditOptions);
        interaction.reply(`${interaction.user.username} снял музыку с паузы.`);
        return;
    }
    if (interaction.customId == 'skip') {
        musicPlayer.playNext();
        interaction.message.edit(musicControlReply() as MessageEditOptions);
        interaction.reply(`${interaction.user.username} пропустил музыку.`);
        return;
    }
    if (interaction.customId == 'stop') {
        musicPlayer.stop();
        interaction.message.edit({ content: 'Музыка выключена пользователем ' + interaction.user.username, embeds: [], components: [] });
        interaction.deferUpdate();
        return;
    }
    if (interaction.customId == 'queue') {
        interaction.reply(queueReply());
        return;
    }
}