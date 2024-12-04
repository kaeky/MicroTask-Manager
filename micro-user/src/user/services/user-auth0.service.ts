import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NEW_USER } from '../constants/user.constant';
import { CreateUserDto } from '../dto/create-user.dto';
import { Auth0Lib } from '../../libs/auth0.lib';

@Injectable()
export class UserAuth0Service {
  constructor(private readonly auth0Lib: Auth0Lib) {}
  @OnEvent(NEW_USER)
  async createUser(createUserDto: CreateUserDto) {
    const user = await this.auth0Lib.createUser(createUserDto);
    console.log(user);
    if (!user?.user_id) {
      return false;
    }

    return user;
  }
}
