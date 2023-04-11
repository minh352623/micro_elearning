import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { TwoFaService } from './two-fa.service';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('two-fa')
export class TwoFaController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFaService,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generate(@Res() response: any, @Req() request: any) {
    const { otpAuthUrl } =
      await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        request.user,
      );
    console.log(otpAuthUrl);
    return this.twoFactorAuthenticationService.pipeQrCodeStream(
      response,
      otpAuthUrl,
    );
  }

  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuthentication(@Req() request: any) {
    await this.userService.turnOnTwoFactorAuthentication(request.user.id);
  }

  @Post('authenticate')
  @UseGuards(JwtAuthGuard)
  async authentication(@Req() request: any, @Body('code') code) {
    console.log(code);
    console.log(request.user);

    const isCodeValid =
      await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        code,
        request.user,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    return this.authService.getAccess2FA(request.user);
  }
}
