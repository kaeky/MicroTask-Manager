import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as process from 'node:process';
import { UserPayloadDto } from '../dto/user-payload.dto';
import * as jwt from 'jsonwebtoken';
import { jwtPayloadDto } from '../dto/jwt-payload.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly reflector: Reflector,
    private readonly httpService: HttpService, // Para enviar peticiones remotas
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided or invalid format');
    }

    const token = authHeader.split(' ')[1];
    const decodedToken: jwtPayloadDto = jwt.decode(token) as jwtPayloadDto;
    const auth0Id = decodedToken.sub.split('|')[1];

    const user = await this.cacheManager.get(auth0Id);
    if (user) {
      request.user = user;
      return true;
    }

    try {
      const user: UserPayloadDto = await firstValueFrom(
        this.httpService.post(
          `${process.env.MICRO_USER}/auth/verifyToken`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      ).then((res) => res.data);
      request.user = user;
      await this.cacheManager.set(auth0Id, user, 24 * 60 * 60);
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token validation failed', err);
    }
  }
}
