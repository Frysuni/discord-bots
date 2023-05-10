export enum validateRoleError {
    Unmoderatable,
    AlreadySetted,
    EveryoneRole
}

export enum validateEmojiError {
    NoEmoji,
    MultipleEmojis,
    UnreachableEmoji
}

export enum EmojiType {
    Undefined,
    Unicode,
    Discord
}

export interface reactRoleAddOptions {
    roleId: string
    emoji: { type: EmojiType, content: string }
    messageId: string
    channelId: string
}