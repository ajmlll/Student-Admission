import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com', description: 'User registered email' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 6, description: 'User password' })
  @IsString()
  @MinLength(6)
  password!: string;
}
