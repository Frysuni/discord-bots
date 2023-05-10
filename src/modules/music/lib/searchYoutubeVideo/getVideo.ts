import envConfig from '@env';
import { music, MusicError } from '../types';
import fetch from './utils/fetch';
import parseISO from './utils/parse_ISO8601';

export default async function(videoId: string) {
    const videoRawInfo = await getRaw(videoId);

    return {
        url: 'https://www.youtube.com/watch?v=' + videoId,
        video: {
            id: videoId,
            title: videoRawInfo.snippet.title.replace('*', '\\*'),
            thumbnail: videoRawInfo.snippet.thumbnails.medium.url,
            length: parseISO(videoRawInfo.contentDetails.duration),
            views: (() => {
                const viewCount = videoRawInfo.statistics.viewCount.toString();
                if (viewCount.length >= 7) return viewCount.slice(undefined, -6) + 'М';
                if (viewCount.length >= 4) return viewCount.slice(undefined, -3) + 'К';
                return viewCount;
            })(),
            likes: (() => {
                const likeCount = videoRawInfo.statistics.likeCount.toString();
                if (likeCount.length >= 7) return likeCount.slice(undefined, -6) + 'М';
                if (likeCount.length >= 4) return likeCount.slice(undefined, -3) + 'К';
                return likeCount;
          })(),
            author: {
                id: videoRawInfo.snippet.channelId,
                url: `https://www.youtube.com/channel/${videoRawInfo.snippet.channelId}`,
                name: videoRawInfo.snippet.channelTitle
            }
        }
    } as music;
}

async function getRaw(videoId: string) {
    const apiUrl = 'https://www.googleapis.com/youtube/v3/videos' +
    '?key=' + envConfig.yt_api_key +
    '&part=contentDetails' +
    '&part=statistics' +
    '&part=snippet' +
    '&id=' + videoId;

    const videoRawInfo = await fetch(apiUrl).catch(() => false);
    if (!videoRawInfo) throw MusicError.UnreachableURL;

    const videoItem = JSON.parse(videoRawInfo as string).items[0];
    if (videoItem.contentDetails?.contentRating?.ytRating == 'ytAgeRestricted') throw MusicError.AgeRestrict;

    return JSON.parse(videoRawInfo as string).items[0];
}