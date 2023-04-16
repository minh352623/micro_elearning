import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { AuthGuard } from '@nestjs/passport';
import { DataAddUserToGroup, GroupDTO } from './group.dto';
import { map } from 'rxjs';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createGroup(
    @Body()
    groupDTO: GroupDTO,
  ) {
    Controller;
    try {
      return (await this.groupService.CreateGroup(groupDTO)).pipe(
        map((data) => {
          return {
            msg: 'Create group successfully',
            data: {
              ...data,
              createAt: Number(data.createAt),
              updateAt: Number(data.updateAt),
            },
          };
        }),
      );
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('pagination')
  async getPaginaion(
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
    @Query('search') search: string = undefined,
    @Query('order_by') order_by: string = 'desc',
  ) {
    try {
      const countGroup = await this.groupService.countGroup();
      return this.groupService.GetAllGroup(limit, page, search, order_by).pipe(
        map((data) => {
          return {
            totalRow: countGroup,
            msg: 'Get all group successfully',
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

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() groupDTO: any) {
    try {
      return (await this.groupService.UpdateGroup(id, groupDTO)).pipe(
        map((data) => {
          return {
            msg: 'Update group successfully',
            data: {
              ...data,
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
      return this.groupService.Delete(id).pipe(
        map((data) => {
          const { ...user } = data;

          return {
            msg: 'Delete group successfully',
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
  @Post('add-user-to-group')
  async addUserToGroup(
    @Body()
    dataAddUserToGroup: DataAddUserToGroup,
  ) {
    Controller;
    try {
      return (await this.groupService.addUserToGroup(dataAddUserToGroup)).pipe(
        map((data) => {
          return {
            msg: 'Add user to group successfully',
            data: {
              ...data,
            },
          };
        }),
      );
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getById/:id')
  async getGroupById(
    @Param('id')
    id: number,
  ) {
    Controller;
    try {
      return (await this.groupService.getOneGroupById(id)).pipe(
        map((data) => {
          return {
            msg: 'Get user successfully',
            data: {
              ...data,
            },
          };
        }),
      );
    } catch (error) {
      console.log(error);
    }
  }
}
