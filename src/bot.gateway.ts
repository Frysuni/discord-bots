import { Injectable, Logger } from '@nestjs/common';
import { Once, InjectDiscordClient, On } from '@discord-nestjs/core';
import { Client, Events } from 'discord.js';

@Injectable()
export class BotGateway {
  constructor(
    @InjectDiscordClient() private readonly client: Client,
  ) {}

  private readonly logger = new Logger(BotGateway.name);

  @Once(Events.ClientReady)
  onReady() {
    this.logger.log(`Bot ${this.client.user?.tag} was started!`);
  }
}