import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The full name of the user' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'john@example.com', description: 'Unique email address' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 6, description: 'Secure password' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    example: 'parent',
    enum: ['parent', 'admission_team'],
    description: 'The user role',
  })
  @IsEnum(['parent', 'admission_team'])
  role!: 'parent' | 'admission_team';
}
