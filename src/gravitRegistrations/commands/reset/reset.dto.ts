import { Param, ParamType } from '@discord-nestjs/core';

export class ResetCommandDto {
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