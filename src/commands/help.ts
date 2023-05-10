import { SlashCommand, SlashCommandImplemetatation, embedColor, getContextLogger } from "@core";
import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, PermissionFlagsBits, EmbedBuilder, APIApplicationCommandPermissionsConstant } from "discord.js";
import { readdirSync } from "node:fs";
import { resolve } from "path";

@SlashCommand()
export class AS implements SlashCommandImplemetatation {
  public readonly logger: ReturnType<typeof getContextLogger> = getContextLogger(AS.data.name + 'Command');

  static readonly data = new SlashCommandBuilder()
    .setName('help')
    .setNameLocalization('ru', 'хелп')
    .setDescription('Show all commands and their descriptions')
    .setDescriptionLocalization('ru', 'Показать все команды и их описание')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .setDMPermission(false);

  public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle(`${interaction.client.user.username} Помощь`)
      .setDescription('Список всех команд')
      .setFooter({ text: 'ENCHALD Development by XJIuPa', iconURL: 'https://i.imgur.com/wQvFvo7.png' })
      .setTimestamp();

    for (const command of this.commands) {
      if (interaction.memberPermissions.has(PermissionFlagsBits[command.default_member_permissions])) {
        embed.addFields({
          name: `**\`/${command.name_localizations?.ru ?? command.name}\`**`,
          value: command.name_localizations?.ru ?? command.description,
          inline: true,
        });
      }
    }

    interaction.reply({ ephemeral: true, embeds: [embed] });
  }


  private commandsCache = new Set<SlashCommandBuilder>();

  private get commands(): IterableIterator<SlashCommandBuilder> {
    if (this.commandsCache.size == 0) {
      const getCommandPath = (command = '') => resolve(__dirname, command);
      readdirSync(getCommandPath()).forEach(command => {
        const slashCommand = require(getCommandPath(command)).AS.data as SlashCommandBuilder;
        this.commandsCache.add(slashCommand);
      });
    }

    return this.commandsCache.values();
  }

}
