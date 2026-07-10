import {
  Controller,
  Get,
  Patch,
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
import { AdmissionService } from './admission.service';
import { UpdateExamScoreDto } from './dto/update-exam-score.dto';
import { AssignCourseDto } from './dto/assign-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admission Workflows')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admission_team')
@Controller('admission')
export class AdmissionController {
  constructor(private readonly admissionService: AdmissionService) {}

  @Get('applications')
  @ApiOperation({
    summary:
      'List all student applications with optional status filter (Staff only)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description:
      'Filter by application status (e.g. SLOT_BOOKED, ADMISSION_COMPLETED)',
  })
  @ApiResponse({ status: 200, description: 'Returns matching applications.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (requires staff role).' })
  async findAll(@Query('status') status?: string) {
    return this.admissionService.findAll(status);
  }

  @Patch(':studentId/exam-score')
  @ApiOperation({
    summary:
      'Record entrance exam score (Staff only, status must be SLOT_BOOKED)',
  })
  @ApiResponse({
    status: 200,
    description: 'Score recorded and status updated to EXAM_COMPLETED.',
  })
  @ApiResponse({
    status: 400,
    description: 'Out of order transition or invalid score value.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  async submitExamScore(
    @Param('studentId') studentId: string,
    @Body() scoreDto: UpdateExamScoreDto,
  ) {
    return this.admissionService.submitExamScore(studentId, scoreDto.score);
  }

  @Patch(':studentId/assign-course')
  @ApiOperation({
    summary:
      'Assign course / grade level (Staff only, status must be EXAM_COMPLETED)',
  })
  @ApiResponse({
    status: 200,
    description: 'Course assigned and status updated to ADMISSION_COMPLETED.',
  })
  @ApiResponse({
    status: 400,
    description: 'Out of order transition or invalid course grade.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  async assignCourse(
    @Param('studentId') studentId: string,
    @Body() courseDto: AssignCourseDto,
  ) {
    return this.admissionService.assignCourse(studentId, courseDto.course);
  }

  @Get('completed')
  @ApiOperation({
    summary: 'Convenience endpoint to retrieve all completed admissions (Staff only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns completed applications list.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findCompleted() {
    return this.admissionService.findAll('ADMISSION_COMPLETED');
  }
}
