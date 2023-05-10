import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, Routes, RESTGetAPIApplicationCommandsResult, REST, RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";
import { ContextLogger, getContextLogger, env } from "@core";

const modules = new Set<ModuleParent>();
const logger = getContextLogger('ModuleResolver');
export const initModules = () => require('../modules');


export function Module(options: {
  disabled?: boolean
  commands?: (new () => SlashCommand)[],
}) {
  return function(
    ModuleTarget: {new (): ModuleParent} & typeof ModuleParent,
  ): void | typeof ModuleTarget {
    if (options.disabled) return;

    logger.debug(`${ModuleTarget.name} resolving`);

    const ModuleInstance = new ModuleTarget();
    logger.debug(`${ModuleTarget.name} instance created`);

    type Writeable<T> = { -readonly [P in keyof T]: T[P] };
    if (options.commands?.length) (ModuleInstance.commands as Writeable<typeof ModuleInstance.commands>) = options.commands.map(command => new command());
    const resolvedCommands = ModuleInstance.commands.map(command => command.data.name);
    if (resolvedCommands.length) logger.debug(`${ModuleTarget.name} resolved commands(${resolvedCommands.length}): ${resolvedCommands.join()}`);

    modules.add(ModuleInstance);
    ModuleInstance.onInit();
    logger.log(`${ModuleTarget.name} initializated`);
  };
}

export abstract class ModuleParent {
  public readonly commands: Readonly<SlashCommand[]> = [];

  public onInit(): void {}
}

export abstract class SlashCommand {
  public data: SlashCommandBuilder;
  public logger: ContextLogger;
  public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {}
}

export function deploySlashCommands() {
  const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  for (const module of modules.values()) for (const command of module.commands) commands.push(command.data.toJSON());

  return new REST({ version: '10', authPrefix: 'Bot', retries: 2 })
    .setToken(env.token)
    .put(
      Routes.applicationCommands(env.clientId),
      { body: commands }
    ) as Promise<RESTGetAPIApplicationCommandsResult>;
}