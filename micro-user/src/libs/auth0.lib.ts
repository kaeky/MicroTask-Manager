import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { auth0Config } from '../config/auth0.config';
import { firstValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class Auth0Lib {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private httpService: HttpService,
  ) {}

  private async request(
    method: string,
    url: string,
    data: any,
    headers: Record<string, any> = {},
  ): Promise<any> {
    const options = {
      method,
      url: `${auth0Config.domain}${url}`,
      headers: {
        ...headers,
      },
      data,
    };

    const response = await firstValueFrom(
      this.httpService.request(options),
    ).catch((error) => error.response);
    return response.data || null;
  }

  private async getApiToken() {
    const token = await this.cacheManager.get('access-token');
    if (token) {
      return token;
    }

    const form = {
      grant_type: 'client_credentials',
      client_id: auth0Config.clientApiClient,
      client_secret: auth0Config.clientApiSecret,
      audience: `${auth0Config.audience}`,
    };
    const body = await this.request('POST', '/oauth/token', form, {
      'Content-Type': 'application/json',
    });

    const requestedToken = body['access_token'] || null;
    if (requestedToken) {
      await this.cacheManager.set('access-token', requestedToken, 24 * 60 * 60);
    }
    return requestedToken;
  }

  public async createUser(user: CreateUserDto) {
    const { email, firstName, lastName, password } = user;
    const accessToken = await this.getApiToken();
    const connection2 = 'Username-Password-Authentication';

    const form = {
      email,
      given_name: firstName,
      family_name: !!lastName?.length ? lastName : ' ',
      name: `${firstName} ${lastName}`,
      password,
      connection: connection2,
    };

    return await this.request('POST', `/api/v2/users`, form, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
  }

  public async changeUserPassword(userId: string, password: string) {
    const accessToken = await this.getApiToken();

    const form = {
      password,
      connection: 'Username-Password-Authentication',
    };

    const { statusCode = 200, ...response } = await this.request(
      'PATCH',
      `/api/v2/users/auth0|${userId}`,
      form,
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    );

    if (statusCode !== 200) {
      throw new BadRequestException(response.message);
    }

    return { statusCode, ...response };
  }

  public async findUserByEmail(email: string) {
    const accessToken = await this.getApiToken();
    return await this.request(
      'GET',
      `/api/v2/users-by-email?email=${encodeURIComponent(email)}`,
      {},
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    );
  }
}
