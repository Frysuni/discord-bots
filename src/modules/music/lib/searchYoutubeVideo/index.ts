import { music, MusicError } from '../types';
import getVideo from './getVideo';
import search from './search';


export default async function(searchString: string): Promise<music> {
    searchString.trim();

    if (searchString.startsWith('http')) {
        const videoId = ytUrlParser(searchString);
        if (!videoId) throw MusicError.WrongURL;
        return getVideo(videoId);
    }

    const videoId = await search(searchString);
    return getVideo(videoId);
}


function ytUrlParser(url: string) {
    const videoRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    // const listRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(playlist\/)|(list\?))\??list?=?([^#&?]*).*/;
    const match = url.match(videoRegex);
    return (match && match[7].length == 11) ? match[7] : false;
}