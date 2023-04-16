import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtTwoFactorStrategy } from 'src/auth/jwtTwoFactor.strategy';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [SearchModule],
  controllers: [GroupController],
  providers: [GroupService, DatabaseService, JwtTwoFactorStrategy, JwtStrategy],
})
export class GroupModule {}
