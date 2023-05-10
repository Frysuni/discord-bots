import { SlashCommand, getContextLogger } from "@core";
import { CacheType, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default class implements SlashCommand {
  public readonly data = new SlashCommandBuilder()
    .setName('example')
    .setNameLocalization('ru', 'пример')
    .setDescription('Command example')
    .setNameLocalization('ru', 'Пример команды')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .setDMPermission(false);

  public readonly logger = getContextLogger(this.data.name + 'Command');

  // execute() exception will be catched automatically for logging
  public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
    this.logger.log(interaction.commandName);
  }
}