import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtTwoFactorStrategy } from 'src/auth/jwtTwoFactor.strategy';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    // JwtModule.register({
    //   secret: process.env.SERECT_JWT,
    //   signOptions: {
    //     expiresIn: process.env.EXPIRESIN,
    //   },
    // }),
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, DatabaseService, JwtTwoFactorStrategy, JwtStrategy],
})
export class UserModule {}
