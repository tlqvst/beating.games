import { User } from '.prisma/client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { AccessTokenPayloadDto } from './dto/accessTokenPayload.dto';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.getUser({ username });

    if (!user)
      throw new UnauthorizedException('Invalid username or password provided.');

    if (!bcrypt.compareSync(pass, user.password)) {
      throw new UnauthorizedException();
    }

    return {
      email: user.email,
      id: user.id,
      name: user.name,
      username: user.username,
    };
  }

  async login(user, res: Response, req: Request) {
    const payload: AccessTokenPayloadDto = {
      username: user.username,
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(payload);

    const decodedToken = this.jwtService.decode(accessToken);
    const cookieExpiresAt = new Date(decodedToken['exp'] * 1000);

    return res
      .set({
        'Set-Cookie': `at=${accessToken}; Path=/; Expires=${cookieExpiresAt}; SameSite=Strict; HttpOnly; Secure`,
      })
      .json(req.user);
  }

  async logout(res: Response) {
    return res.set({ 'Set-Cookie': `at=''; Path=/; Expires=0;` }).json('OK');
  }
}
