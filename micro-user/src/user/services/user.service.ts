import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NEW_USER, UPDATE_USER } from '../constants/user.constant';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const idAuth0: any = await this.eventEmitter
      .emitAsync(NEW_USER, createUserDto)
      .then((result) => result[0].identities[0].user_id);

    return await this.userRepository.createUser(createUserDto, idAuth0);
  }

  findCurrentUser(user: UserEntity) {
    return user;
  }

  public async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find({ where: { status: true } });
  }
  public async findByAuth0Id(auth0Id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { auth0Id, status: true },
    });
    if (!user) {
      throw new NotFoundException(`User with auth0Id "${auth0Id}" not found`);
    }
    return user;
  }

  async update(user: UserEntity, updateUserDto: UpdateUserDto) {
    const updateAuth0 = await this.eventEmitter
      .emitAsync(UPDATE_USER, user, updateUserDto)
      .then((result) => result[0].identities[0].user_id);
    return await this.userRepository.updateUser(
      user,
      updateUserDto,
      updateAuth0,
    );
  }

  async removeUser(user: UserEntity) {
    return await this.userRepository.updateUser(user, { status: false });
  }
}
