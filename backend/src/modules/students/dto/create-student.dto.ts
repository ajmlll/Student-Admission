import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ example: 'Alice Doe', description: 'The student\'s full name' })
  @IsString()
  @IsNotEmpty()
  studentName!: string;

  @ApiProperty({ example: '2015-05-15', description: 'Date of birth (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth!: string;

  @ApiProperty({
    example: 'female',
    enum: ['male', 'female', 'other'],
    description: 'Gender description',
  })
  @IsEnum(['male', 'female', 'other'])
  gender!: 'male' | 'female' | 'other';

  @ApiPropertyOptional({
    example: 'Greenfield Elementary School',
    description: 'The student\'s previous school attended',
  })
  @IsString()
  @IsOptional()
  previousSchool?: string;

  @ApiProperty({
    example: 'Grade 1',
    enum: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'],
    description: 'Grade they are applying for',
  })
  @IsEnum(['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'])
  applyingGrade!: 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4';
}
