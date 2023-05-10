import { ContextLogger, SlashCommand, SlashCommandImplemetatation, getContextLogger } from "@core";
import { CacheType, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

@SlashCommand()
export class AS implements SlashCommandImplemetatation {
  static readonly data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup a new server bot')

    // .addStringOption(botId => botId
    //   .se
    //   )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false);

  public readonly logger: ContextLogger = getContextLogger(AS.data.name + 'Command');

  public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {

  }
}