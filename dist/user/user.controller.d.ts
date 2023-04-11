import { UserDTO } from './user.dto';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(request: Request, userDTO: UserDTO): Promise<import("rxjs").Observable<{
        msg: string;
        data: {
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
        };
    }>>;
}
