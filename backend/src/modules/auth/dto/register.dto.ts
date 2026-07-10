import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
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
    description: 'Role for registration (only "parent" is permitted via public registration)',
    required: false,
    default: 'parent',
  })
  @IsEnum(['parent', 'admission_team'])
  @IsOptional()
  role?: 'parent' | 'admission_team' = 'parent';
}
