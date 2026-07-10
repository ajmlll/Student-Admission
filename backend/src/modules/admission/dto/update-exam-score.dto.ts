import { IsInt, Min, Max, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateExamScoreDto {
  @ApiProperty({
    example: 85,
    description: 'The entrance exam score obtained by the student (0-100)',
  })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  score!: number;
}
