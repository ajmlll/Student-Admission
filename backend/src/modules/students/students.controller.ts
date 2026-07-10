import {
  Controller,
  Get,
  Post,
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
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles('parent')
  @ApiOperation({
    summary: 'Create a new student admission application (Parent role only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Application created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Validation or payload error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access token.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access - requires parent role.',
  })
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @CurrentUser() user: any,
  ) {
    return this.studentsService.create(createStudentDto, user.id);
  }

  @Patch(':id')
  @Roles('parent')
  @ApiOperation({
    summary:
      'Update student details (Owner Parent only, prior to registration fee payment)',
  })
  @ApiResponse({
    status: 200,
    description: 'Application updated successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access token.' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - not owner parent, or application details are locked.',
  })
  @ApiResponse({ status: 404, description: 'Student profile not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
    @CurrentUser() user: any,
  ) {
    return this.studentsService.update(id, updateStudentDto, user);
  }

  @Get(':id')
  @Roles('parent', 'admission_team')
  @ApiOperation({
    summary:
      'Retrieve student application by ID (Owner Parent or Admission staff)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns student application details.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access token.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access - parent does not own student.',
  })
  @ApiResponse({ status: 404, description: 'Student profile not found.' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.studentsService.findOne(id, user);
  }

  @Get()
  @Roles('parent', 'admission_team')
  @ApiOperation({
    summary:
      'List student applications (Parents see own list, Admission staff see all)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description:
      'Filter by application status (e.g. ADMISSION_COMPLETED, APPLICATION_CREATED) - Staff only',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns list of student applications.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access token.' })
  async findAll(
    @CurrentUser() user: any,
    @Query('status') statusFilter?: string,
  ) {
    return this.studentsService.findAll(user, statusFilter);
  }
}
