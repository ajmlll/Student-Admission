import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from '../students/schemas/student.schema';
import { StudentsService } from '../students/students.service';

@Injectable()
export class AdmissionService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    private studentsService: StudentsService,
  ) {}

  async submitExamScore(
    studentId: string,
    score: number,
  ): Promise<StudentDocument> {
    const student = await this.studentModel.findById(studentId).exec();
    if (!student) {
      throw new NotFoundException(
        `Student application with ID "${studentId}" not found`,
      );
    }

    if (student.status !== 'SLOT_BOOKED') {
      throw new BadRequestException(
        `Cannot enter exam score: student is not in "SLOT_BOOKED" status (current: "${student.status}").`,
      );
    }

    student.examScore = score;
    student.status = 'EXAM_COMPLETED';
    return student.save();
  }

  async assignCourse(
    studentId: string,
    course: string,
  ): Promise<StudentDocument> {
    const student = await this.studentModel.findById(studentId).exec();
    if (!student) {
      throw new NotFoundException(
        `Student application with ID "${studentId}" not found`,
      );
    }

    if (student.status !== 'EXAM_COMPLETED') {
      throw new BadRequestException(
        `Cannot assign course: exam not yet completed for this student (current: "${student.status}").`,
      );
    }

    student.assignedCourse = course;
    student.status = 'ADMISSION_COMPLETED';
    return student.save();
  }

  async findAll(statusFilter?: string): Promise<StudentDocument[]> {
    // Reuses the studentsService logic with an administrative role context
    return this.studentsService.findAll(
      { role: 'admission_team' },
      statusFilter,
    );
  }
}
