import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/all')
  findAllUsers() {
    return this.userService.findAll();
  }

  @Get('/profile')
  findCurrentUser(@CurrentUser() user: UserEntity) {
    return this.userService.findCurrentUser(user);
  }

  @Patch()
  updateUser(
    @CurrentUser() user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(user, updateUserDto);
  }

  @Delete()
  removeUser(@CurrentUser() user: UserEntity) {
    return this.userService.removeUser(user);
  }
}
