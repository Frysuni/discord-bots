import { Param, ParamType } from '@discord-nestjs/core';

export class RegisterCommandDto {
  @Param({
    name: 'username',
    nameLocalizations: { 'ru': 'ник' },
    description: 'Game username',
    descriptionLocalizations: { 'ru': 'Игровой ник' },
    type: ParamType.STRING,
    required: true,
    minLength: 3,
    maxLength: 16,
  })
  username: string;

  @Param({
    name: 'password',
    nameLocalizations: { ru: 'пароль' },
    description: 'Password from the account in the launcher system',
    descriptionLocalizations: { ru: 'Пароль от аккаунта в системе лаунчера' },
    type: ParamType.STRING,
    required: true,
    minLength: 6,
    maxLength: 32,
  })
  password: string;
}