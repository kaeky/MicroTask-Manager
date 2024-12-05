import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NEW_USER, UPDATE_USER } from '../constants/user.constant';
import { CreateUserDto } from '../dto/create-user.dto';
import { Auth0Lib } from '../../libs/auth0.lib';
import { UserEntity } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

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

  @OnEvent(UPDATE_USER)
  async updateUser(user: UserEntity, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.auth0Lib.updateUser(user, updateUserDto);
    if (updateUserDto.password) {
      await this.auth0Lib.changeUserPassword(
        updatedUser.user_id,
        updateUserDto.password,
      );
    }

    if (!updatedUser?.user_id) {
      return false;
    }
    return updatedUser;
  }
}
