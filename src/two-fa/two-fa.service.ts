import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { UserDTO } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import 'dotenv/config';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class TwoFaService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
    return toFileStream(stream, otpAuthUrl);
  }

  async generateTwoFactorAuthenticationSecret(user: any) {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      user.email,
      process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
      secret,
    );
    await this.userService.setTwoFactorAuthenticationSecret(secret, user.id);
    return {
      secret,
      otpAuthUrl,
    };
  }

  async isTwoFactorAuthenticationCodeValid(code: string, user: any) {
    return authenticator.verify({
      token: code,
      secret: user.twoFactorAuthenticationSecret,
    });
  }
}
