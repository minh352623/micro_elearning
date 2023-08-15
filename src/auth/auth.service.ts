import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { UserDTO, UserRegisterDTO } from 'src/user/user.dto';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
require('dotenv').config();

@Injectable()
export class AuthService {
  private loggerService: Logger;

  constructor(
    private readonly jwtService: JwtService,
    private databaseService: DatabaseService,
  ) {
    this.loggerService = new Logger();
  }

  async register(user: UserRegisterDTO) {
    this.loggerService.log('Register User');

    try {
      user.password = await bcrypt.hash(user.password, 10);
      const userNew = await this.databaseService.user.create({
        data: { ...user } as Prisma.UserCreateInput ,
      });
      const payload = { ...userNew };
      const token = this.jwtService.sign(payload);
      return { token: token };
    } catch (err) {
      console.log(err);
      if (err.code === '23505') {
        throw new ConflictException('Username has already been taken');
      }
      throw new InternalServerErrorException();
    }
  }

  async login(user: any) {
    this.loggerService.log('Login User');

    try {
      const where = {
        email: user.email,
      } as Prisma.UserWhereUniqueInput;
      const userOld = (await this.databaseService.user.findUnique({
        where: where,
      })) as any;
      console.log(userOld);

      if (!userOld)
        return {
          message: 'Email does not match',
        };

      console.log(userOld.password);

      const isValid = await bcrypt.compare(user.password, userOld.password);
      if (!isValid)
        return {
          message: 'Password is not valid',
        };
      const { isTwoFactorAuthenticationEnabled, ...dataSign } = userOld;
      const payload = {
        ...dataSign,
      };
      const token = this.jwtService.sign(payload);
      return { token: token };
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getAccess2FA(user: any) {
    try {
      const payload = {
        ...user,
        isSecondFactorAuthenticated: true,
      };
      console.log();

      const token = this.jwtService.sign(payload, {
        secret: process.env.SERECT_JWT,
      });

      return { token };
    } catch (e) {
      console.log(e);
    }
  }
}
