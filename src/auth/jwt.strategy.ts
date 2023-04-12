import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Prisma } from '@prisma/client';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { DatabaseService } from 'src/database/database.service';
require('dotenv').config();
console.log(process.env.SERECT_JWT);
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly databaseService: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SERECT_JWT,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    const { email, username } = payload;

    const user: any = await this.databaseService.user.findUnique({
      where: {
        email: email,
      } as Prisma.UserWhereUniqueInput,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
