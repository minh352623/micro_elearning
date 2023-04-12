import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  index = 'exchange';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPost(exchange: any) {
    return this.elasticsearchService.index<any>({
      index: this.index,
      document: {
        id: exchange.id,
        price_exchange: exchange.price_exchange,
        name_exchange: exchange.name_exchange,
        quantity_exchange: exchange.quantity_exchange,
      },
    });
  }

  async search(text: string) {
    const body = await this.elasticsearchService.search({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['name_exchange', 'price_exchange'],
          },
        },
      },
    });
    console.log(body);

    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }

  async remove(postId: number) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: postId,
          },
        },
      },
    });
  }

  // async update(post: any) {
  //   const newBody: any = {
  //     id: post.id,
  //     title: post.title,
  //     content: post.content,
  //     authorId: post.author.id,
  //   };

  //   const script: any = Object.entries(newBody).reduce(
  //     (result, [key, value]) => {
  //       return `${result} ctx._source.${key}='${value}';`;
  //     },
  //     '',
  //   );

  //   return this.elasticsearchService.updateByQuery({
  //     index: this.index,
  //     body: {
  //       query: {
  //         match: {
  //           id: post.id,
  //         },
  //       },
  //       script: {
  //         inline: script as any,
  //       },
  //     },
  //   });
  // }
}
