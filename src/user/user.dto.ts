import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  fullname: string;

  avatar: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export class UserRegisterDTO {
  @IsNotEmpty()
  fullname: string;

  avatar: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}
