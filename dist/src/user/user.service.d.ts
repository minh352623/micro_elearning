import { UserDTO } from './user.dto';
import { DatabaseService } from 'src/database/database.service';
import { SearchService } from 'src/search/search.service';
import { KafkaService } from 'src/kafka/kafka.service';
import { MailerService } from '@nest-modules/mailer';
import 'dotenv/config';
export declare class UserService {
    private databaseService;
    private readonly searchService;
    private readonly kafkaService;
    private mailerService;
    private loggerService;
    constructor(databaseService: DatabaseService, searchService: SearchService, kafkaService: KafkaService, mailerService: MailerService);
    onModuleInit(): Promise<void>;
    forgotPassword(userDTO: UserDTO): Promise<{
        message: string;
    }>;
    changePassword(userDTO: UserDTO): Promise<{
        message: string;
    }>;
    CreateUser(userDTO: UserDTO): Promise<import("rxjs").Observable<{
        createAt: number;
        updateAt: number;
        id: number;
        fullname: string;
        avatar: string;
        address: string;
        phone: string;
        age: number;
        email: string;
        password: string;
        twoFactorAuthenticationSecret: string;
        isTwoFactorAuthenticationEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        deleted: boolean;
    }>>;
    countUser(): Promise<number>;
    createManyUser(fileUsers: any): Promise<{
        msg: string;
    }>;
    UpdateUser(id: number, userDTO: any): Promise<import("rxjs").Observable<import(".prisma/client").User>>;
    Delete(id: number): import("rxjs").Observable<import(".prisma/client").User>;
    GetAllUser(limit?: number, page?: number, search?: string, order_by?: string): import("rxjs").Observable<import(".prisma/client").User[]>;
    setTwoFactorAuthenticationSecret(secret: string, user_id: number): Promise<import(".prisma/client").User>;
    turnOnTwoFactorAuthentication(user_id: number): Promise<import(".prisma/client").User>;
    GetAllGroup(id: number): import("rxjs").Observable<{
        email: string;
        fullname: string;
        groups: {
            group: {
                name: string;
            };
            groupId: number;
        }[];
    }>;
}
