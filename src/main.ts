import { client,  env, getContextLogger } from "@core";


void async function() {
  const logger = getContextLogger('Starter');
  logger.debug('Инициализация...');
  // Initialization hook

  logger.log('Запуск бота...');
  client.hooks.emit('preRun');

  logger.debug('Обновление слеш-команд');
  // const deploySlashCommandsResponse = await deploySlashCommands(env.clientId, env.token);
  // logger.log(`Обновлено ${deploySlashCommandsResponse.length} слеш-комманд`);
  client.hooks.emit('commandsSetup');

  logger.debug('Регистрация бота в сети');
  await client.login(env.token);

  // Late start hook
  client.user.setStatus('idle');

  logger.log('Бот запущен.');

  require('./core/moduleHandler');
}();

