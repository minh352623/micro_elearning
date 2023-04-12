import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';
require('dotenv').config();

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.register({
      node: process.env.HOST_ELASTIC,
      auth: {
        username: process.env.USER_ELASTIC,
        password: process.env.PASS_ELASTIC,
      },
      tls: {
        rejectUnauthorized: false,
      },
    }),
  ],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
