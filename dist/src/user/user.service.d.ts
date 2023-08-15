import { UserDTO } from './user.dto';
import { DatabaseService } from 'src/database/database.service';
import { MailerService } from '@nest-modules/mailer';
import 'dotenv/config';
export declare class UserService {
    private databaseService;
    private mailerService;
    private loggerService;
    constructor(databaseService: DatabaseService, mailerService: MailerService);
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
        status: string;
        sort: number;
        user_created: string;
        date_created: Date;
        user_updated: string;
        date_updated: Date;
        fullname: string;
        avatar: string;
        address: string;
        phone: string;
        age: number;
        email: string;
        password: string;
        twoFactorAuthenticationSecret: string;
        isTwoFactorAuthenticationEnabled: boolean;
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
}
