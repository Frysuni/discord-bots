import SimpleMusicPlayer from './lib';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, InteractionReplyOptions, MessageCreateOptions } from 'discord.js';
import { music, TypeOfProcessing } from './lib/types';

export const musicPlayer = new SimpleMusicPlayer();

export function musicControlReply() {
    const state = musicPlayer.state();
    if (!state.inVoice) return { ephemeral: true, content: 'Бот не находится в голосовом канале и не проигрывает музыку.' } as InteractionReplyOptions;

    const embed = new EmbedBuilder()
        .setTitle('Управление музкой')
        .setColor('Blue')
        .addFields({ name: '\u200B', value:
            (state.paused ? '▶️ - **Продолжить музыку.**' : '⏸ - **Поставить на паузу.**\n') +
            '⏭ - **Пропустить трек.**\n' +
            '📋 - **Показать очередь музыки.**\n' +
            '⏹ - **Выключить музыку и отключить бота.**'
        });


    const controlButtons = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(state.paused ? 'unpause' : 'pause')
                .setEmoji(state.paused ? '▶️' : '⏸')
                .setStyle(state.paused ? ButtonStyle.Success : ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('skip')
                .setEmoji('⏭')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('queue')
                .setEmoji('📋')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('stop')
                .setEmoji('⏹')
                .setStyle(ButtonStyle.Danger)
            );

    return { embeds: [embed], components: [controlButtons] } as InteractionReplyOptions & MessageCreateOptions;
}

export function newMusicReply(music: { process: TypeOfProcessing, result: music, position: number }) {
    const embed = new EmbedBuilder()
        .setColor('#f90606')
        .setAuthor({ name: 'YouTube: ' + music.result.video.author.name, url: music.result.video.author.url })
        .setTitle(music.result.video.title)
        .setURL(music.result.url)
        .addFields({
            name: (() => {
                if (music.process == TypeOfProcessing.Started) return 'Музыка запущена.';
                if (music.process == TypeOfProcessing.Resumed) return 'Бот снят с паузы и включена данная музыка.';
                if (music.process == TypeOfProcessing.Added) return `Позиция в очереди: \`${music.position}\``;
                if (music.process == TypeOfProcessing.NowPlaying) return 'Играет следующая музыка!';
            })(),
            value: `Длина музыки: \`${music.result.video.length.time}\`` })
        .setThumbnail(music.result.video.thumbnail)
        .setFooter({ text: `Просмотров: ${music.result.video.views} Лайков: ${music.result.video.likes}` });

    return { embeds: [embed] } as InteractionReplyOptions & MessageCreateOptions;
}

export function queueReply() {
    const embed = new EmbedBuilder()
        .setColor('Blue')
        .addFields({ name: 'Очередь музыки.',
            value: (() => {
                if (musicPlayer.queue.length == 0) return 'В очереди нет музыки.';
                let i = 1;
                let result = '';
                musicPlayer.queue.forEach(music => {
                    if (i > 5) return;
                    result += `${i}. **[${music.video.title}](${music.url})** - \`${music.video.length.time}\`\n`;
                    i++;
                });
                if (i > 5) result += '...';
                return result;
            })()
        });

    return { embeds: [embed] } as InteractionReplyOptions & MessageCreateOptions;
}