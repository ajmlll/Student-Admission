import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ExamSlotsService } from './exam-slots.service';
import { CreateExamSlotDto } from './dto/create-exam-slot.dto';
import { BookExamSlotDto } from './dto/book-exam-slot.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Exam Slots')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exam-slots')
export class ExamSlotsController {
  constructor(private readonly examSlotsService: ExamSlotsService) {}

  @Post()
  @Roles('admission_team')
  @ApiOperation({ summary: 'Create a new entrance exam slot (Staff only)' })
  @ApiResponse({ status: 201, description: 'Exam slot created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized JWT.' })
  @ApiResponse({ status: 403, description: 'Forbidden (requires staff role).' })
  async create(@Body() createExamSlotDto: CreateExamSlotDto) {
    return this.examSlotsService.create(createExamSlotDto);
  }

  @Get()
  @Roles('parent', 'admission_team')
  @ApiOperation({
    summary: 'List available exam slots (Staff can request all via query)',
  })
  @ApiQuery({
    name: 'all',
    required: false,
    description:
      'If true, returns all slots including booked ones (Staff only)',
  })
  @ApiResponse({ status: 200, description: 'Returns matching exam slots.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(@CurrentUser() user: any, @Query('all') all?: string) {
    const showAll = all === 'true';
    return this.examSlotsService.findAll(user, showAll);
  }

  @Post(':id/book')
  @Roles('parent')
  @ApiOperation({
    summary: 'Book an entrance exam slot for a student (Parent only)',
  })
  @ApiResponse({ status: 200, description: 'Exam slot booked successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Validation error / student not eligible / slot booked.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (parent does not own student).',
  })
  @ApiResponse({ status: 404, description: 'Slot or Student not found.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict (slot was concurrently booked).',
  })
  async bookSlot(
    @Param('id') id: string,
    @Body() bookDto: BookExamSlotDto,
    @CurrentUser() user: any,
  ) {
    return this.examSlotsService.bookSlot(id, bookDto.studentId, user);
  }
}
