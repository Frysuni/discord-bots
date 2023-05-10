import envConfig from '@env';
import { MusicError } from '../types';
import fetch from './utils/fetch';

export default async function(searchString: string): Promise<string> {
    const apiUrl = 'https://www.googleapis.com/youtube/v3/search' +
    '?key=' + envConfig.yt_api_key +
    '&type=video' +
    '&part=snippet' +
    '&order=relevance' +
    '&q=' + searchString + ' music|song|музыка|песня|sound|track|медиа|трэк' +
    '&safeSearch=moderate' +
    '&maxResults=1';

    const videos = JSON.parse(await fetch(apiUrl))?.items;
    if (videos.length == 0) throw MusicError.NoResult;

    return videos[0].id.videoId;
}