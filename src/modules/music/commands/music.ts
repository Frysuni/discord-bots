import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { musicControlReply, musicPlayer, newMusicReply } from '..';
import { MusicError } from '../lib/types';

export const data = new SlashCommandBuilder()
    .setName('music')
    .setNameLocalization('ru', 'музыка')

    .setDescription('Открыть панель управления музыкой.')

    .addSubcommand(music => music
        .setName('add')
        .setNameLocalization('ru', 'включить')

        .setDescription('Включить или добавить в очередь песню.')

        .addStringOption(search => search
            .setName('search')
            .setNameLocalization('ru', 'поиск')

            .setDescription('Вставьте ссылку ютуб или введите посиковый запрос.')

            .setRequired(true)))


    .addSubcommand(panel => panel
        .setName('panel')
        .setNameLocalization('ru', 'панель_управления')

        .setDescription('Вызвать панель управления.'))

    .setDMPermission(false);

export const execute = async (interaction: ChatInputCommandInteraction) => {
    if (interaction.options.getSubcommand() == 'panel') {
        const memberVoice = interaction.guild.members.cache.get(interaction.user.id).voice?.channel;

        if (!musicPlayer.state().inVoice) {
            interaction.reply({ ephemeral: true, content: 'Бот не находится в голосовом канале и не проигрывает музыку.' });
            return;
        }
        if (!memberVoice || musicPlayer.voiceChannel?.id != memberVoice.id) {
            interaction.reply({ ephemeral: true, content: 'Вы не находитесь в одном канале с ботом.' });
            return;
        }

        interaction.reply(musicControlReply());
        musicPlayer.setupTextChannel(interaction.channel);
    }

    if (interaction.options.getSubcommand() == 'add') {
        const searchString = interaction.options.getString('search').trim();
        const memberVoiceChannel = (interaction.member as GuildMember).voice?.channel;

        if (!memberVoiceChannel) {
            interaction.reply({ ephemeral: true, content: 'Вы должны находиться в голосовом канале' });
            return;
        }
        musicPlayer.setupTextChannel(interaction.channel);
        const music = await musicPlayer.newMusic(searchString, memberVoiceChannel).catch((e: MusicError) => e);

        if (music == MusicError.WrongURL) interaction.reply({ ephemeral: true, content: 'Указана неправильная ссылка или ссылка не на ютуб.' });
        else if (music == MusicError.NoResult) interaction.reply({ ephemeral: true, content: 'Не найдено музыки по вашему поисковому запросу.\nПопробуйте указать ссылку на ютуб.' });
        else if (music == MusicError.UnreachableURL) interaction.reply({ ephemeral: true, content: 'Скорее всего, это приватное видео.' });
        else if (music == MusicError.AgeRestrict) interaction.reply({ ephemeral: true, content: 'Видео ограничено по возрасту.' });
        else if (music == MusicError.WrongVoice) interaction.reply({ ephemeral: true, content: 'Вы не находитесь в канале, где проигрывается музыка, следственно вы не можете ею управлять.\nЭто просто исправить! Что насчет послушать музыку со всеми?' });
        else if (typeof music != 'object') interaction.reply({ ephemeral: true, content: 'Неизвестная ошибка.' });
        else interaction.reply(newMusicReply(music));
    }
};

