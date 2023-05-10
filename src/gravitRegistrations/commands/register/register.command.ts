import { Command, Handler, IA } from '@discord-nestjs/core';
import { SlashCommandPipe } from '@discord-nestjs/common';
import { ApplicationCommandType, ChatInputCommandInteraction, InteractionReplyOptions, PermissionFlagsBits } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { RegisterCommandDto } from './register.dto';
import { UsersProvider } from '~/gravitRegistrations/users.provider';


@Command({
  name: 'register',
  nameLocalizations: { ru: 'зарегистрироваться' },
  description: 'Register an account in the launcher system',
  descriptionLocalizations: { ru: 'Зарегистрировать аккаунт в системе лаунчера' },
  defaultMemberPermissions: PermissionFlagsBits.UseApplicationCommands,
  dmPermission: true,
  type: ApplicationCommandType.ChatInput,
})
@Injectable()
export class RegisterCommand {
  constructor(
    private readonly usersProvider: UsersProvider,
  ) {}

  @Handler()
  async handler(@IA(SlashCommandPipe) options: RegisterCommandDto, @IA() interaction: ChatInputCommandInteraction): Promise<InteractionReplyOptions> {

    if (await this.usersProvider.userExists(options.username)) return { content: 'Пользователь с таким никнеймом уже зарегистрирован.', ephemeral: true };
    if (await this.usersProvider.userExists(undefined, interaction.user.id)) return { content: 'На Ваш дискорд аккаунт уже зарегистрирован профиль в системе лаунчера.', ephemeral: true };

    await this.usersProvider.createUser(options.username, interaction.user.id, options.password);

    return { content: 'Вы были успешно зарегистрированы!', ephemeral: true };
  }
}