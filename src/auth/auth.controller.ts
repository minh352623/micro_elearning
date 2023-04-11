import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO, UserRegisterDTO } from 'src/user/user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('jwt-two-factor'))
  @Post('/register')
  register(@Body() user: UserRegisterDTO) {
    try {
      return this.authService.register(user);
    } catch (err) {
      console.log(err);
    }
  }

  @Post('/login')
  login(@Body() user: any) {
    try {
      console.log(user);

      return this.authService.login(user);
    } catch (err) {
      return err;
    }
  }
}
