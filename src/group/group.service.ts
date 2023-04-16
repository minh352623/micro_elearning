import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { SearchService } from 'src/search/search.service';
import { DataAddUserToGroup, GroupDTO } from './group.dto';
import { from, of, switchMap } from 'rxjs';
import { Prisma } from '@prisma/client';

@Injectable()
export class GroupService {
  private loggerService: Logger;

  constructor(
    private databaseService: DatabaseService,

    private readonly searchService: SearchService,
  ) {
    this.loggerService = new Logger();
  }

  async CreateGroup(group: GroupDTO) {
    try {
      this.loggerService.log('Create Group');
      const groupCreate = await this.databaseService.group.create({
        data: {
          ...group,
        },
      });
      const currentTime = new Date().getTime();

      return of({
        ...groupCreate,
        createAt: currentTime,
        updateAt: currentTime,
      });
    } catch (err) {
      console.log(err);
      this.loggerService.error('Failed to update user', err);
      throw err;
    }
  }

  async UpdateGroup(id: number, groupData: any) {
    try {
      this.loggerService.log('Update Group ' + id);
      return from(
        this.databaseService.group.update({
          data: {
            ...groupData,
          },
          where: {
            id: Number(id),
          },
        }),
      );
    } catch (err) {
      console.log(err);

      this.loggerService.error('Failed to update group', err);
      throw err;
    }
  }

  Delete(id: number) {
    try {
      this.loggerService.log('Create delete exchange ' + id);
      return from(
        this.databaseService.group.findUnique({
          where: {
            id: Number(id),
          },
        }),
      ).pipe(
        switchMap((data) => {
          if (data.id == id) {
            return from(
              this.databaseService.group.update({
                data: {
                  deleted: true,
                } as Prisma.GroupUpdateInput,
                where: {
                  id: Number(id),
                },
              }),
            );
          }
          throw new HttpException(
            'Not found user have id ->: ' + id,
            HttpStatus.BAD_REQUEST,
          );
        }),
      );
    } catch (err) {
      this.loggerService.error('Failed to delete exchange', err);
      throw err;
    }
  }

  GetAllGroup(
    limit: number = 10,
    page: number = 1,
    search: string = '',
    order_by: string = 'desc',
  ) {
    try {
      this.loggerService.log('Get group dashboard');
      if (limit <= 0 || page <= 0)
        throw new HttpException(
          'limit or page is invalid',
          HttpStatus.BAD_REQUEST,
        );

      return from(
        this.databaseService.group.findMany({
          where: {
            OR: [
              {
                name: { contains: search },
              },
            ],
            deleted: false,
          },

          take: Number(limit),
          skip: Number(limit) * (Number(page) - 1),
          orderBy: {
            id: order_by === 'desc' ? 'desc' : 'asc',
          },
        }),
      );
    } catch (err) {
      this.loggerService.error('Failed to get users', err);
      throw err;
    }
  }

  async countGroup() {
    try {
      return await this.databaseService.group.count({
        where: {
          deleted: false,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async addUserToGroup(dataAddUserToGroup: DataAddUserToGroup) {
    try {
      const dataNew = dataAddUserToGroup.groups.map((group_id) => ({
        groupId: group_id,
        userId: dataAddUserToGroup.id_user,
      }));
      return from(
        this.databaseService.groupUser.createMany({
          data: dataNew,
        }),
      );
    } catch (err) {
      console.log(err);
    }
  }

  async getOneGroupById(id: number) {
    try {
      return from(
        this.databaseService.group.findUnique({
          where: {
            id: Number(id),
          },
          include: {
            users: {
              include: {
                user: {
                  select: {
                    fullname: true,
                  },
                },
              },
            },
          },
        }),
      );
    } catch (err) {
      console.log(err);
    }
  }
}
