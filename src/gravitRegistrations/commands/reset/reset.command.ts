import { Command, Handler, IA } from '@discord-nestjs/core';
import { SlashCommandPipe } from '@discord-nestjs/common';
import { ApplicationCommandType, ChatInputCommandInteraction, InteractionReplyOptions, PermissionFlagsBits } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { ResetCommandDto } from './reset.dto';
import { UsersProvider } from '~/gravitRegistrations/users.provider';

@Command({
  name: 'reset',
  nameLocalizations: { ru: 'сброс' },
  description: 'Change the password of the launcher system profile',
  descriptionLocalizations: { ru: 'Изменить пароль профиля системы лаунчера' },
  defaultMemberPermissions: PermissionFlagsBits.UseApplicationCommands,
  dmPermission: true,
  type: ApplicationCommandType.ChatInput,
})
@Injectable()
export class ResetCommand {
  constructor(
    private readonly usersProvider: UsersProvider,
  ) {}

  @Handler()
  async handler(@IA(SlashCommandPipe) options: ResetCommandDto, @IA() interaction: ChatInputCommandInteraction): Promise<InteractionReplyOptions> {
    const user = await this.usersProvider.getUserByDiscordId(interaction.user.id);

    if (!user) return { content: 'У вас еще не зарегистрирован профиль в системе лаунчера.', ephemeral: true };

    await this.usersProvider.changePassword(user.username, options.password);

    return { content: 'Пароль успешно сменён!', ephemeral: true };
  }
}