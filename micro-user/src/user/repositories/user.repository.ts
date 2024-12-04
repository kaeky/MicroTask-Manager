import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  public findOne = this.userRepository.findOne.bind(this.userRepository);

  public async createUser(
    userDto: CreateUserDto,
    auth0Id: string,
  ): Promise<UserEntity> {
    return this.userRepository.save({ ...userDto, auth0Id });
  }
}
