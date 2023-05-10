// import {
//   SlashCommandBuilder,
//   CacheType,
//   Events,
//   ChatInputCommandInteraction,
//   REST,
//   RESTGetAPIApplicationCommandsResult,
//   RESTPostAPIChatInputApplicationCommandsJSONBody,
//   Routes,
// } from "discord.js";
// import { ContextLogger, client } from "@core";
// import { resolve } from "node:path";
// import { readdirSync } from "node:fs";

// const slashCommands = new Map<string, typeof SlashCommandImplemetatation>();

// client.on(Events.InteractionCreate, (interaction) => {
//   if (!interaction.isChatInputCommand()) return;
//   if (!slashCommands.has(interaction.commandName)) return;

//   const slashCommand = new (slashCommands.get(interaction.commandName));
//   slashCommand.logger.debug(`${interaction.member.user.username} - ${interaction.channelId}`);
//   slashCommand.execute(interaction).catch(slashCommand.logger.error);
// });

// export function SlashCommand() {
//   return (function(
//     slashCommandTarget: typeof SlashCommandImplemetatation,
//     ) {
//     slashCommands.set(slashCommandTarget.data.name, slashCommandTarget);
//   });
// }

// export class SlashCommandImplemetatation {
//   static readonly data: SlashCommandBuilder;
//   public readonly logger: ContextLogger;
//   public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {}
// }

// export function deploySlashCommands(
//   applicationId: string,
//   botToken: string,
//   commandsPath: string[] = ['./commands'],
// ) {
//   const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

//   const getCommandPath = (command = '') => resolve(__dirname, '../', ...commandsPath, command);
//   readdirSync(getCommandPath()).forEach(command => {
//     const slashCommand = require(getCommandPath(command)).AS.data as SlashCommandBuilder;
//     commands.push(slashCommand.toJSON());
//   });

//   return new REST({ version: '10', authPrefix: 'Bot', retries: 2 })
//     .setToken(botToken)
//     .put(
//       Routes.applicationCommands(applicationId),
//       { body: commands }
//     ) as Promise<RESTGetAPIApplicationCommandsResult>;
// }