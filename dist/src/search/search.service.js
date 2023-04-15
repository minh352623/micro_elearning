"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const elasticsearch_1 = require("@nestjs/elasticsearch");
let SearchService = class SearchService {
    constructor(elasticsearchService) {
        this.elasticsearchService = elasticsearchService;
    }
    async createIndex(index, data) {
        return this.elasticsearchService.index({
            index: index,
            document: Object.assign({}, data),
        });
    }
    async search(index, text, from = 5, size = 10) {
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
    async remove(index, dataId) {
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
};
SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [elasticsearch_1.ElasticsearchService])
], SearchService);
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map