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
exports.KafkaService = void 0;
const common_1 = require("@nestjs/common");
const kafkajs_1 = require("kafkajs");
require('dotenv').config();
let KafkaService = class KafkaService {
    constructor() {
        this.loggerService = new common_1.Logger();
        this.kafkaClient = new kafkajs_1.Kafka({
            clientId: 'exchange-microservice',
            brokers: [process.env.HOST_KAFKA],
            sasl: {
                mechanism: process.env.MECHANISM,
                username: process.env.USERNAME_KAFKA,
                password: process.env.PASSWORD_KAFKA,
            },
        });
        this.consumer = this.kafkaClient.consumer({
            groupId: 'elearning-user-microservice',
        });
        this.producer = this.kafkaClient.producer();
    }
    async CheckAndCreateTopic(topic) {
        const admin = this.kafkaClient.admin();
        await admin.connect();
        const listTopic = await admin.listTopics();
        if (!listTopic.includes(topic)) {
            await admin.createTopics({
                topics: [{ topic: topic }],
            });
        }
        await admin.disconnect();
    }
    async SendMessage(topic, message) {
        await this.CheckAndCreateTopic(topic);
        await this.producer.connect();
        const sended = await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
        await this.producer.disconnect();
        return sended;
    }
    GetConsumer(groupId = undefined) {
        if (groupId) {
            return this.kafkaClient.consumer({
                groupId: groupId,
            });
        }
        return this.consumer;
    }
};
KafkaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], KafkaService);
exports.KafkaService = KafkaService;
//# sourceMappingURL=kafka.service.js.map