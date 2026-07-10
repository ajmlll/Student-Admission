import { IsDateString, IsNotEmpty, IsString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExamSlotDto {
  @ApiProperty({ example: '2026-07-15', description: 'Exam slot date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @ApiProperty({ example: '10:00 AM', description: 'Exam slot time' })
  @IsString()
  @IsNotEmpty()
  time!: string;

  @ApiPropertyOptional({ example: 1, description: 'Seating capacity (defaults to 1)' })
  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;
}
