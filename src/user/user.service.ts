import { Injectable, Logger } from '@nestjs/common';
import { UserDTO } from './user.dto';
import { DatabaseService } from 'src/database/database.service';
import { of } from 'rxjs';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  private loggerService: Logger;

  constructor(private databaseService: DatabaseService) {
    this.loggerService = new Logger();
  }

  async CreateUser(userDTO: UserDTO) {
    try {
      this.loggerService.log('Create User');

      const userCreate = await this.databaseService.user.create({
        data: {
          ...userDTO,
        },
      });
      const currentTime = new Date().getTime();

      return of({
        ...userCreate,
        createAt: currentTime,
        updateAt: currentTime,
      });
    } catch (err) {}
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
}
