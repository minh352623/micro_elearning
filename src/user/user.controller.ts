import {
  Body,
  Controller,
  Post,
  UseGuards,
  Put,
  Param,
  Delete,
  Get,
  Query,
  Req,
} from '@nestjs/common';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';
import { map } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt-two-factor'))
  @Post()
  async createUser(@Req() request: Request, @Body() userDTO: UserDTO) {
    try {
      return (await this.userService.CreateUser(userDTO)).pipe(
        map((data) => {
          return {
            msg: 'Create buy exchange successfully',
            data: {
              ...data,
              createAt: Number(data.createAt),
              updateAt: Number(data.updateAt),
            },
          };
        }),
      );
    } catch (err) {
      console.log(err);
    }
  }
}
