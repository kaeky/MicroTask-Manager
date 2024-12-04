import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Auth0PayloadDto } from './dto/auth0-payload.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public async validateUserFromAuth0Payload(
    auth0Payload: Auth0PayloadDto,
  ): Promise<UserEntity> {
    const auth0Id = auth0Payload.sub.split('|')[1];
    const user = await this.userService.findByAuth0Id(auth0Id);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
