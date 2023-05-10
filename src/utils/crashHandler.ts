import Logger from '@logger';

Logger.Debug('Crash Handler установлен.');

process.on('uncaughtException', async (err, origin) => {
    Logger.Error(`В боте возникла ошибка ${origin} !\n ${err.stack ? err.stack : err}`);
    Logger.Discord(`**В боте возникла ошибка \`${origin}\` !**\n\`\`\`\n${err.stack ? err.stack : err}\n\`\`\``);
});