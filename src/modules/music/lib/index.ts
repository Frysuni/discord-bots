/* eslint-disable no-console */
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, StreamType, VoiceConnection, VoiceConnectionStatus } from '@discordjs/voice';
import * as ytdl from 'discord-ytdl-core';
import { VoiceBasedChannel, MessageCreateOptions, GuildTextBasedChannel } from 'discord.js';
import searchVideo from './searchYoutubeVideo';
import { music, MusicError, TypeOfProcessing } from './types';
import { newMusicReply } from '../index';

export default class SimpleMusicPlayer {
    public queue: music[] = [];
    private audioPlayer = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } });
    private voiceConnection: VoiceConnection;
    public playing = false;
    public voiceChannel: VoiceBasedChannel;
    public textChannel: GuildTextBasedChannel;

    constructor() {
        this.audioPlayer.on('stateChange', (oldstate, state) => { if (state.status == AudioPlayerStatus.Idle) this.play(); });
    }

    public async newMusic(music: string, voiceChannel: VoiceBasedChannel) {
        const state = this.state();
        if (!state.inVoice) {
            const result = await searchVideo(music);
            const position = this.queue.push(result);
            await this.join(voiceChannel);
            this.play(true);
            return { process: TypeOfProcessing.Started, result, position };
        }
        else if (!state.playing) {
            if (voiceChannel != this.voiceChannel) throw MusicError.WrongVoice;

            const result = await searchVideo(music);
            const position = this.queue.unshift(result);

            return { process: TypeOfProcessing.Resumed, result, position };
        }
        else {
            if (voiceChannel != this.voiceChannel) throw MusicError.WrongVoice;

            const result = await searchVideo(music);
            const position = this.queue.push(result);

            return { process: TypeOfProcessing.Added, result, position };
        }

    }
    public setupTextChannel(channel: GuildTextBasedChannel) {
        this.textChannel = channel;
    }
    public playNext() {
        this.audioPlayer.stop();
        this.audioPlayer.unpause();
    }
    public async play(noLog?: true | undefined) {
        if (this.queue.length == 0) {
            this.voiceConnection.disconnect();
            this.queue = [];
            this.textChannel.send('Музыка закончилась. Еще разок?');
            return;
        }

        const music = this.queue.shift();

        const audioResource = createAudioResource(
            ytdl(music.url, { filter: 'audioonly', opusEncoded: true }),
            { inputType: StreamType.Opus }
        );

        this.audioPlayer.play(audioResource);
        if (!noLog) this.textChannel.send(newMusicReply({ process: TypeOfProcessing.NowPlaying, result: music, position: 0 }) as MessageCreateOptions);
    }

    public async join(voiceChannel: VoiceBasedChannel) {
        const voiceConnection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guildId,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            selfDeaf: true
        });
        this.voiceChannel = voiceChannel;
        voiceConnection.subscribe(this.audioPlayer);
        voiceConnection.on('stateChange', (oldstate, state) => {
            if (state.status == VoiceConnectionStatus.Disconnected) voiceConnection.destroy();
        });
        this.voiceConnection = voiceConnection;
    }

    public async stop() {
        this.queue = [];
        this.audioPlayer.stop();
        this.voiceConnection.disconnect();
    }

    public async pause() {
        this.audioPlayer.pause(true);
    }
    public async unpause() {
        this.audioPlayer.unpause();
    }

    public state() {
        return {
            inVoice: this.voiceConnection?.state?.status == VoiceConnectionStatus.Ready,
            playing: this.audioPlayer.state.status == AudioPlayerStatus.Playing,
            paused: this.audioPlayer.state.status == AudioPlayerStatus.Paused,
            playerStatus: this.audioPlayer.state.status
        };
    }
}
