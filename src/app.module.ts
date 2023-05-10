import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotGateway } from 'bot.gateway';
import { DiscordModuleRegister } from 'discord-config.service';
import ormConfig from 'ormconfig';
import { GravitRegistrationsModule } from './gravitRegistrations/gravitRegistrations.module';


@Module({
  imports: [
    ...DiscordModuleRegister,
    TypeOrmModule.forRoot(ormConfig),
    GravitRegistrationsModule,
  ],
  providers: [BotGateway],
})
export class AppModule {}
