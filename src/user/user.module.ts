import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtTwoFactorStrategy } from 'src/auth/jwtTwoFactor.strategy';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { SearchService } from 'src/search/search.service';
import { SearchModule } from 'src/search/search.module';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { DatabaseModule } from 'src/database/database.module';
import { CloudinaryModule } from 'src/cloundinay/cloudinary.module';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [
    // JwtModule.register({
    //   secret: process.env.SERECT_JWT,
    //   signOptions: {
    //     expiresIn: process.env.EXPIRESIN,
    //   },
    // }),
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    // AuthModule,
    SearchModule,
    CloudinaryModule,
    KafkaModule,
  ],
  controllers: [UserController],
  providers: [UserService, DatabaseService, JwtTwoFactorStrategy, JwtStrategy],
})
export class UserModule {}
