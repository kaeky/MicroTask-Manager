import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NEW_USER } from '../constants/user.constant';

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

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
