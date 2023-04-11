import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TwoFaModule } from './two-fa/two-fa.module';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule, TwoFaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
