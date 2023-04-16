import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { UserDTO } from './user.dto';
import { DatabaseService } from 'src/database/database.service';
import { from, of, switchMap } from 'rxjs';
import { Prisma } from '@prisma/client';
import { SearchService } from 'src/search/search.service';
// import XLSX from 'xlsx';
const XLSX = require('xlsx');

import * as bcrypt from 'bcryptjs';
import path from 'path';

@Injectable()
export class UserService {
  private loggerService: Logger;

  constructor(
    private databaseService: DatabaseService,

    private readonly searchService: SearchService,
  ) {
    this.loggerService = new Logger();
  }

  async CreateUser(userDTO: UserDTO) {
    try {
      this.loggerService.log('Create User');
      userDTO.password = await bcrypt.hash(userDTO.password, 10);
      const userCreate = await this.databaseService.user.create({
        data: {
          ...userDTO,
        },
      });
      const currentTime = new Date().getTime();
      const test = await this.searchService.createIndex('user', userCreate);

      return of({
        ...userCreate,
        createAt: currentTime,
        updateAt: currentTime,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async countUser() {
    try {
      return await this.databaseService.user.count();
    } catch (err) {
      console.log(err);
    }
  }

  async createManyUser(fileUsers: any) {
    try {
      this.loggerService.log('Create Many User');

      const workbook = XLSX.readFile(fileUsers.path);
      const workSheet = workbook.Sheets[workbook.SheetNames[0]];

      const userArr = [];
      for (let index = 2; index < 5; index++) {
        let hash =
          workSheet[`D${index}`]?.v &&
          bcrypt.hashSync((workSheet[`D${index}`]?.v).toString());

        const user = {
          fullname: workSheet[`B${index}`]?.v,
          email: workSheet[`C${index}`]?.v,
          password: hash,
        };
        if (user.fullname && user.email && user.password) {
          userArr.push(user);
        }
      }

      if (userArr.length > 0) {
        const importUsers = await this.databaseService.user.createMany({
          data: userArr,
        });

        return {
          msg: 'excel successfully imported',
        };
      }
      throw new HttpException('Data not found', HttpStatus.BAD_REQUEST);
    } catch (err) {
      console.log(err);
    }
  }

  async UpdateUser(id: number, userDTO: any) {
    try {
      this.loggerService.log('Update User');

      // const userUpdate =
      return from(
        this.databaseService.user.update({
          data: {
            ...userDTO,
          } as Prisma.UserUpdateInput,
          where: {
            id: Number(id),
          } as Prisma.UserWhereUniqueInput,
        }),
      );
    } catch (err) {
      this.loggerService.error('Failed to update user', err);
      throw err;
    }
  }

  Delete(id: number) {
    try {
      this.loggerService.log('Create delete exchange ' + id);
      return from(
        this.databaseService.user.findUnique({
          where: {
            id: Number(id),
          },
        }),
      ).pipe(
        switchMap((data) => {
          if (data.id == id) {
            return from(
              this.databaseService.user.update({
                data: {
                  deleted: true,
                } as Prisma.UserUpdateInput,
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

  GetAllUser(
    limit: number = 10,
    page: number = 1,
    search: string = '',
    order_by: string = 'desc',
  ) {
    try {
      this.loggerService.log('Get users dashboard');

      // const data = await this.searchService.search('user', search);

      // return data;

      if (limit <= 0 || page <= 0)
        throw new HttpException(
          'limit or page is invalid',
          HttpStatus.BAD_REQUEST,
        );

      return from(
        this.databaseService.user.findMany({
          where: {
            OR: [
              {
                fullname: { contains: search },
              },
              {
                email: { contains: search },
              },
              {
                address: { contains: search },
              },
            ],
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

  async setTwoFactorAuthenticationSecret(secret: string, user_id: number) {
    return this.databaseService.user.update({
      data: { twoFactorAuthenticationSecret: secret } as Prisma.UserUpdateInput,
      where: { id: user_id },
    });
  }

  async turnOnTwoFactorAuthentication(user_id: number) {
    return this.databaseService.user.update({
      data: {
        isTwoFactorAuthenticationEnabled: true,
      } as Prisma.UserUpdateInput,
      where: {
        id: user_id,
      },
    });
  }

  GetAllGroup(id: number) {
    try {
      this.loggerService.log('Get all group');

      return from(
        this.databaseService.user.findUnique({
          where: {
            id: Number(id),
          },
          select: {
            // This will work!
            email: true,
            fullname: true,
            groups: {
              select: {
                groupId: true,
                group: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          // include: {
          //   groups: {
          //     include: {
          //       group: {
          //         select: {
          //           name: true,
          //         },
          //       },
          //     },
          //   },
          // },
        }),
      );
    } catch (err) {
      this.loggerService.error('Failed to get users', err);
      throw err;
    }
  }
}
