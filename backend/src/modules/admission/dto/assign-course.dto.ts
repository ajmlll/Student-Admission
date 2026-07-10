import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignCourseDto {
  @ApiProperty({
    example: 'Grade 1',
    enum: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'],
    description: 'The grade level course assigned to the student',
  })
  @IsEnum(['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'])
  @IsNotEmpty()
  course!: 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4';
}
