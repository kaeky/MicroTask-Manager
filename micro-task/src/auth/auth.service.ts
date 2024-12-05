import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserPayloadDto } from './dto/user-payload.dto';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async validateToken(userPayload: UserPayloadDto): Promise<any> {
    const auth0Id = userPayload.auth0Id;
    const user = await this.cacheManager.get(auth0Id);
    console.log('user', user);
    //const user = await this.userService.findByAuth0Id(auth0Id);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
