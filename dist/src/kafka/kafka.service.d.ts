import { Consumer } from 'kafkajs';
export declare class KafkaService {
    private loggerService;
    private kafkaClient;
    private consumer;
    private producer;
    constructor();
    CheckAndCreateTopic(topic: string): Promise<void>;
    SendMessage(topic: string, message: Object): Promise<import("kafkajs").RecordMetadata[]>;
    GetConsumer(groupId?: string | undefined): Consumer;
}
