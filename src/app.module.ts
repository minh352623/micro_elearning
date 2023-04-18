import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TwoFaModule } from './two-fa/two-fa.module';
import { SearchService } from './search/search.service';
import { SearchModule } from './search/search.module';
import { CloudinaryModule } from './cloundinay/cloudinary.module';
import { GroupModule } from './group/group.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    TwoFaModule,
    SearchModule,
    CloudinaryModule,
    GroupModule,
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
