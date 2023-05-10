import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { hashSync } from "bcryptjs";
import { Repository } from "typeorm";
import { UsersEntity } from "./entities/users.entity";


@Injectable()
export class UsersProvider {
  constructor(
    @InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  createUser(username: string, discordId: string, password: string) {
    password = hashSync(password, 10);
    return this.usersRepository.save({ username, password, discordId });
  }

  userExists(username?: string, discordId?: string) {
    return this.usersRepository.exist({ where: [{ username }, { discordId }] });
  }

  changePassword(username: string, password: string) {
    password = hashSync(password, 10);
    return this.usersRepository.update({ username }, { password });
  }

  getUserByDiscordId(discordId: string) {
    return this.usersRepository.findOne({ where: { discordId } });
  }

}