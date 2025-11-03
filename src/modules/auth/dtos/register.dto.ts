import { IsEmail, IsString, IsIn } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  fullname: string;

  @IsString()
  @IsIn(['client', 'freelancer'], { message: 'Role must be client or freelancer' })
  role: 'client' | 'freelancer';
}
