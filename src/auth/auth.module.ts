import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { DatabaseService } from 'src/database/database.service';
import { JwtTwoFactorStrategy } from './jwtTwoFactor.strategy';
require('dotenv').config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SERECT_JWT,
      signOptions: {
        expiresIn: process.env.EXPIRESIN,
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AuthService, JwtStrategy, DatabaseService, JwtTwoFactorStrategy],
  exports: [PassportModule, JwtStrategy, JwtTwoFactorStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
