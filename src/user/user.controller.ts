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
  Patch,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';
import { map } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { store_config } from 'utils/config-store';
import { CloudinaryService } from 'src/cloundinay/cloudinary.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('avatar', store_config))
  async createUser(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
    avatar: Express.Multer.File,

    @Req()
    @Body()
    userDTO: UserDTO,
  ) {
    try {
      const avatarFile = await this.cloudinaryService.uploadImage(avatar);
      userDTO.avatar = avatarFile.url;
      return (await this.userService.CreateUser(userDTO)).pipe(
        map((data) => {
          return {
            msg: 'Create user successfully',
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

  @UseGuards(AuthGuard('jwt'))
  @Post('createManyFromExcel')
  @UseInterceptors(FileInterceptor('fileUsers', store_config))
  async createManyUser(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 100000 }),
          // new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
    fileUsers: Express.Multer.File,
  ) {
    try {
      console.log(fileUsers);
      // return 1;
      return this.userService.createManyUser(fileUsers);
    } catch (err) {
      console.log(err);
    }
  }

  @UseGuards(AuthGuard('jwt-two-factor'))
  @Get('profile')
  async getProfile(@Req() req: any) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() userDTO: any) {
    try {
      return (await this.userService.UpdateUser(id, userDTO)).pipe(
        map((data) => {
          return {
            msg: 'Update user successfully',
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

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteUserById(@Param('id') id: number) {
    try {
      return this.userService.Delete(id).pipe(
        map((data) => {
          const { ...user } = data;

          return {
            msg: 'Delete user successfully',
            data: {
              ...user,
              createAt: Number(data.createdAt),
              updateAt: Number(data.updatedAt),
            },
          };
        }),
      );
    } catch (err) {
      console.log(err);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('pagination')
  getPaginaion(
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
    @Query('search') search: string = undefined,
    @Query('order_by') order_by: string = 'desc',
  ) {
    try {
      return this.userService.GetAllUser(limit, page, search, order_by).pipe(
        map((data) => {
          return {
            msg: 'Get all user successfully',
            data: data.map((e) => {
              const { deleted, ...user } = e;
              return {
                ...user,
                createAt: Number(e.createdAt),
                updateAt: Number(e.updatedAt),
              };
            }),
          };
        }),
      );
    } catch (err) {
      throw err;
    }
  }
}
