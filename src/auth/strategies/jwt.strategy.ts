import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenPayloadDto } from '../dto/accessTokenPayload.dto';
import { ConfigService } from '@nestjs/config';
import { ReqUser } from 'src/types/ReqUser';

const jwtCookieExtractor = (req: Request) => {
  return req.cookies?.at;
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Auth header
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // From cookie
        jwtCookieExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'), // Retrieve JWT secret from config service
    });
  }

  /*
   * Populates the req object with a 'user' object
   */
  async validate(payload: AccessTokenPayloadDto): Promise<ReqUser> {
    return {
      userId: payload.sub,
      username: payload.username,
    };
  }
}
