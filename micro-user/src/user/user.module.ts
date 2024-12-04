import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';
import { UserAuth0Service } from './services/user-auth0.service';
import { Auth0Lib } from '../libs/auth0.lib';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), HttpModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserAuth0Service, Auth0Lib],
})
export class UserModule {}
