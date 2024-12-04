import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NEW_USER } from '../constants/user.constant';
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
    console.log(user);
    return user;
  }

  public async findByAuth0Id(auth0Id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { auth0Id },
    });
    if (!user) {
      throw new NotFoundException(`User with auth0Id "${auth0Id}" not found`);
    }
    return user;
  }

  public async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }

    return user;
  }

  public async findSmallByAuth0Id(auth0Id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'displayName',
        'auth0Id',
        'auth0Ids',
        'specialtyId',
        'typeId',
        'documentId',
        'country',
        'status',
      ],
      where: `"auth0Id" ~* '${auth0Id}' or '${auth0Id}' = ANY ("auth0Ids")`,
      relations: ['country'],
    });

    if (!user) {
      throw new NotFoundException(`User with auth0Id "${auth0Id}" not found`);
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
