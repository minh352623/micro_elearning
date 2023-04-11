import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import 'dotenv/config';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(
  Strategy,
  'jwt-two-factor',
) {
  constructor(private readonly databaseService: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SERECT_JWT,
      ignoreExpiration: true,
    });
  }

  async validate({ email, isTwoFactorAuthenticationEnabled }) {
    console.log({ isTwoFactorAuthenticationEnabled, email });

    const user: any = await this.databaseService.user.findUnique({
      where: {
        email: email,
      } as Prisma.UserWhereUniqueInput,
    });

    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    if (
      user.isTwoFactorAuthenticationEnabled &&
      !isTwoFactorAuthenticationEnabled
    ) {
      throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
    }

    return user;
  }
}
