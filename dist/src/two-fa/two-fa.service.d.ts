import { UserService } from 'src/user/user.service';
import 'dotenv/config';
import { AuthService } from 'src/auth/auth.service';
export declare class TwoFaService {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    pipeQrCodeStream(stream: Response, otpAuthUrl: string): Promise<any>;
    generateTwoFactorAuthenticationSecret(user: any): Promise<{
        secret: string;
        otpAuthUrl: string;
    }>;
    isTwoFactorAuthenticationCodeValid(code: string, user: any): Promise<boolean>;
}
