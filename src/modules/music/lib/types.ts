export type music = {
    url: string
    video: {
        id: string
        title: string
        thumbnail: string | null
        length: {
            seconds: number
            time: string
        },
        views: string
        likes: string
        author: {
            id: string
            url: string
            name: string
        }
    }
}

export enum TypeOfProcessing {
    Started,    // Бот подключился и начал проигрывание
    Added,      // Добавлено в конец очереди
    Resumed,    // У бота закончилась музыка, но он был все еще в войсе
    NowPlaying  // Бот перешел к следующей музыке
}
export enum MusicError {
    WrongURL, // Not youtube URL string
    UnreachableURL, // Unreachable video
    NoResult, // No search results
    WrongVoice, // Бот в другом канале.
    AgeRestrict // Видео ограничено по возрасту, анонимно скачать нельзя!
}