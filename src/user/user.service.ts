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
import { KafkaService } from 'src/kafka/kafka.service';
import { MailerService } from '@nest-modules/mailer';
import 'dotenv/config';

@Injectable()
export class UserService {
  private loggerService: Logger;

  constructor(
    private databaseService: DatabaseService,

    private readonly searchService: SearchService,
    private readonly kafkaService: KafkaService,
    private mailerService: MailerService,
  ) {
    this.loggerService = new Logger();
  }

  async onModuleInit() {
    try {
      const consumerExchangeQoc = this.kafkaService.GetConsumer();
      const consumerStatusExchangeQoc = this.kafkaService.GetConsumer(
        'exchange-microservice-status',
      );
    } catch (err) {
      this.loggerService.error('An error while init the module exchange', err);
    }
  }

  async forgotPassword(userDTO: UserDTO) {
    try {
      this.loggerService.log('Forgot Passowrd');
      const check_sended_mail =
        await this.databaseService.forgotPassword.findFirst({
          where: {
            email: userDTO.email,
          } as Prisma.ForgotPasswordWhereUniqueInput,
          orderBy: {
            createdAt: 'desc',
          },
        });

      if (check_sended_mail) {
        let now_date = new Date();
        let data_token = new Date(check_sended_mail.createdAt);
        console.log(now_date);
        console.log(data_token);

        const minus = (now_date.getTime() - data_token.getTime()) / (1000 * 60);
        //check phai 1 phut sao khi gửi mail mới dc gửi tiếp
        console.log(minus);

        if (minus > Number(process.env.TIME_LIMIT_SENDMAIL)) {
          this.mailerService.sendMail({
            to: userDTO.email,
            subject: 'Welcome to my website',
            template: './forgotPassword',
            context: {
              link: 'http://localhost:3001/front-end',
            },
          });
        } else {
          throw new HttpException(
            'Sau 1 phút mới được gửi mail lần tiếp theo!!!',
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        this.mailerService.sendMail({
          to: userDTO.email,
          subject: 'Welcome to my website',
          template: './forgotPassword',
          context: {
            link: 'http://localhost:3001/front-end',
          },
        });
      }

      const forgot_check = await this.databaseService.forgotPassword.create({
        data: {
          email: userDTO.email,
        },
      });
      console.log({ forgot_check });
      return {
        message: 'send mail success',
      };
    } catch (err) {
      console.log(err);
    }
  }
  async changePassword(userDTO: UserDTO) {
    try {
      this.loggerService.log('Change passsowrd');
      const check_sended_mail =
        await this.databaseService.forgotPassword.findFirst({
          where: {
            email: userDTO.email,
          } as Prisma.ForgotPasswordWhereUniqueInput,
          orderBy: {
            createdAt: 'desc',
          },
        });

      if (check_sended_mail) {
        let now_date = new Date();
        let data_token = new Date(check_sended_mail.createdAt);
        const minus = (now_date.getTime() - data_token.getTime()) / (1000 * 60);
        if (minus > Number(process.env.TIME_EFFECTIVE_SENDMAIL)) {
          throw new HttpException(
            `Xác nhận mail có hiệu lực trong vòng ${process.env.TIME_EFFECTIVE_SENDMAIL} phút!!!`,
            HttpStatus.BAD_REQUEST,
          );
        } else {
          userDTO.password = await bcrypt.hash(userDTO.password, 10);

          await this.databaseService.user.update({
            data: {
              ...userDTO,
            } as Prisma.UserUpdateInput,
            where: {
              email: userDTO.email,
            } as Prisma.UserWhereUniqueInput,
          });
        }
      } else {
        throw new HttpException(
          'Ban phải xác nhận qua mail trước !!',
          HttpStatus.BAD_REQUEST,
        );
      }

      const forgot_check = await this.databaseService.forgotPassword.deleteMany(
        {
          where: {
            email: userDTO.email,
          },
        },
      );

      return {
        message: 'Change password  success',
      };
    } catch (err) {
      console.log(err);
    }
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
