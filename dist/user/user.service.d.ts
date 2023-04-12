import { UserDTO } from './user.dto';
import { DatabaseService } from 'src/database/database.service';
export declare class UserService {
    private databaseService;
    private loggerService;
    constructor(databaseService: DatabaseService);
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
    }>>;
    setTwoFactorAuthenticationSecret(secret: string, user_id: number): Promise<import(".prisma/client").User>;
    turnOnTwoFactorAuthentication(user_id: number): Promise<import(".prisma/client").User>;
}
