import { ElasticsearchService } from '@nestjs/elasticsearch';
export declare class SearchService {
    private readonly elasticsearchService;
    constructor(elasticsearchService: ElasticsearchService);
    createIndex(index: string, data: any): Promise<import("@elastic/elasticsearch/lib/api/types").WriteResponseBase>;
    search(index: string, text: string, from?: number, size?: number): Promise<unknown[]>;
    remove(index: string, dataId: number): Promise<void>;
}
