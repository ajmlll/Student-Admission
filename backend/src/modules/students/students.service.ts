import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  // Helper ownership validator
  private checkAccess(student: StudentDocument, currentUser: any) {
    if (currentUser.role === 'admission_team') {
      return;
    }
    if (student.parentId.toString() !== currentUser.id) {
      throw new ForbiddenException(
        'You do not have permission to access this student profile.',
      );
    }
  }

  async create(
    createStudentDto: CreateStudentDto,
    parentId: string,
  ): Promise<StudentDocument> {
    const { studentName, dateOfBirth, gender, previousSchool, applyingGrade } =
      createStudentDto;

    const newStudent = new this.studentModel({
      parentId: new Types.ObjectId(parentId),
      studentName,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      previousSchool,
      applyingGrade,
      status: 'APPLICATION_CREATED',
    });

    return newStudent.save();
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
    currentUser: any,
  ): Promise<StudentDocument> {
    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new NotFoundException(`Student application with ID "${id}" not found`);
    }

    // Verify parent owns the student record (or user is admission_team)
    this.checkAccess(student, currentUser);

    // Enforce edit lock: only allow if status is APPLICATION_CREATED
    if (student.status !== 'APPLICATION_CREATED') {
      throw new ForbiddenException(
        'Student details are locked after registration fee payment.',
      );
    }

    // Update allowable fields
    if (updateStudentDto.studentName !== undefined) {
      student.studentName = updateStudentDto.studentName;
    }
    if (updateStudentDto.dateOfBirth !== undefined) {
      student.dateOfBirth = new Date(updateStudentDto.dateOfBirth);
    }
    if (updateStudentDto.gender !== undefined) {
      student.gender = updateStudentDto.gender;
    }
    if (updateStudentDto.previousSchool !== undefined) {
      student.previousSchool = updateStudentDto.previousSchool;
    }
    if (updateStudentDto.applyingGrade !== undefined) {
      student.applyingGrade = updateStudentDto.applyingGrade;
    }

    return student.save();
  }

  async findOne(id: string, currentUser: any): Promise<StudentDocument> {
    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new NotFoundException(`Student application with ID "${id}" not found`);
    }

    // Verify parent ownership or staff clearance
    this.checkAccess(student, currentUser);

    return student;
  }

  async findAll(
    currentUser: any,
    statusFilter?: string,
  ): Promise<StudentDocument[]> {
    if (currentUser.role === 'parent') {
      // Parent: only return their own children
      return this.studentModel
        .find({ parentId: new Types.ObjectId(currentUser.id) })
        .exec();
    } else {
      // Admission Team: return all, optionally filtered by status
      const query: any = {};
      if (statusFilter) {
        query.status = statusFilter;
      }
      return this.studentModel.find(query).exec();
    }
  }

  async payFee(id: string, currentUser: any): Promise<StudentDocument> {
    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new NotFoundException(`Student application with ID "${id}" not found`);
    }

    this.checkAccess(student, currentUser);

    if (student.status !== 'APPLICATION_CREATED') {
      throw new BadRequestException(
        `Cannot pay registration fee. Student application status is "${student.status}" instead of "APPLICATION_CREATED".`,
      );
    }

    student.registrationFee = {
      paid: true,
      paidAt: new Date(),
    };
    student.status = 'REGISTRATION_FEE_PAID';

    return student.save();
  }
}
