import { AuthService } from './auth.service';
import { UserRegisterDTO } from 'src/user/user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(user: UserRegisterDTO): Promise<{
        token: string;
    }>;
    login(user: any): any;
}
