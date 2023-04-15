import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { UserRegisterDTO } from 'src/user/user.dto';
export declare class AuthService {
    private readonly jwtService;
    private databaseService;
    private loggerService;
    constructor(jwtService: JwtService, databaseService: DatabaseService);
    register(user: UserRegisterDTO): Promise<{
        token: string;
    }>;
    login(user: any): Promise<{
        message: string;
        token?: undefined;
    } | {
        token: string;
        message?: undefined;
    }>;
    getAccess2FA(user: any): Promise<{
        token: string;
    }>;
}
