import { TwoFaService } from './two-fa.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
export declare class TwoFaController {
    private readonly twoFactorAuthenticationService;
    private userService;
    private authService;
    constructor(twoFactorAuthenticationService: TwoFaService, userService: UserService, authService: AuthService);
    generate(response: any, request: any): Promise<any>;
    turnOnTwoFactorAuthentication(request: any): Promise<void>;
    authentication(request: any, code: any): Promise<{
        token: string;
    }>;
}
