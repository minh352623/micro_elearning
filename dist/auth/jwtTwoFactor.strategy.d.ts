import 'dotenv/config';
import { DatabaseService } from 'src/database/database.service';
declare const JwtTwoFactorStrategy_base: new (...args: any[]) => any;
export declare class JwtTwoFactorStrategy extends JwtTwoFactorStrategy_base {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    validate({ email, isTwoFactorAuthenticationEnabled }: {
        email: any;
        isTwoFactorAuthenticationEnabled: any;
    }): Promise<any>;
}
export {};
