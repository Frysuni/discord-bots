import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterCommand } from './commands/register/register.command';
import { ResetCommand } from './commands/reset/reset.command';
import { UsersProvider } from './users.provider';
import { HwidsEntity } from './entities/hwids.entity';
import { UsersEntity } from './entities/users.entity';

@Module({
  imports: [
    DiscordModule.forFeature(),
    TypeOrmModule.forFeature([UsersEntity, HwidsEntity]),
  ],
  providers: [
    UsersProvider,
    RegisterCommand,
    ResetCommand,
  ],
})
export class GravitRegistrationsModule {}
