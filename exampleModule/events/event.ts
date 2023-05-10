import { Events, Message } from 'discord.js';

export const type = Events.MessageCreate;

export const execute = (message: Message) => {
    message.channel.send(message.content);
};