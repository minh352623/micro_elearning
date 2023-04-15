import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async createIndex(index: string, data: any) {
    return this.elasticsearchService.index<any>({
      index: index,
      document: {
        ...data,
      },
    });
  }

  async search(
    index: string,
    text: string,
    from: number = 5,
    size: number = 10,
  ) {
    console.log({ text, index });

    const body = await this.elasticsearchService.search({
      index: index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['_all'],
          },
        },
      },
    });
    console.log(body);

    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }

  async remove(index: string, dataId: number) {
    this.elasticsearchService.deleteByQuery({
      index: index,
      body: {
        query: {
          match: {
            id: dataId,
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
