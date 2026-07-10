import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BookExamSlotDto {
  @ApiProperty({
    example: '60d5ec49f83cd82470123456',
    description: 'The student ID booking the exam slot',
  })
  @IsString()
  @IsNotEmpty()
  studentId!: string;
}
