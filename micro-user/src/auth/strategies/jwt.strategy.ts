import * as querystring from 'querystring';
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { auth0Config } from '../../config/auth0.config';
import { AuthService } from '../auth.service';
import { Auth0PayloadDto } from '../dto/auth0-payload.dto';

/**
 * Messy function to get the token from the header
 *
 * @param req
 * @constructor
 */
function JwtFromCookieOrHeaderAsBearerToken(req: Request) {
  // As a default check, lets try to get it from the header
  const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  // console.log(token);
  if (!token) {
    // Now lets try from the cookie
    if (typeof req.header === 'function') {
      const cookie = req.header('cookie') || '';
      return querystring.parse(cookie)['access_token'] || null;
    }

    return null;
  }
  return token;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly authService: AuthService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${auth0Config.domain}/.well-known/jwks.json`,
        handleSigningKeyError: (err, cb) => {
          this.logger.error(err.message, err.stack);
          cb(err);
        },
      }),
      jwtFromRequest: JwtFromCookieOrHeaderAsBearerToken,
      audience: auth0Config.audience,
      issuer: `${auth0Config.domain}/`,
      algorithms: ['RS256'],
    });
  }

  public validate(payload: Auth0PayloadDto) {
    return this.authService.validateUserFromAuth0Payload(payload);
  }
}
