import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { auth0Config } from '../config/auth0.config';
import { firstValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

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

    try {
      const response = await firstValueFrom(this.httpService.request(options));
      return response.data || null;
    } catch (error) {
      console.error('HTTP Request error:', error);
      throw error;
    }
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
      audience: `${auth0Config.domain}/api/v2/`,
    };

    const body = await this.request('POST', '/oauth/token', form, {
      'content-type': 'application/x-www-form-urlencoded',
    });

    const requestedToken = body['access_token'] || null;
    if (requestedToken) {
      await this.cacheManager.set('access-token', requestedToken, 24 * 60 * 60);
    }

    return requestedToken;
  }
}
