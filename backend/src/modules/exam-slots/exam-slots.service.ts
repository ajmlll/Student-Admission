import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ExamSlot, ExamSlotDocument } from './schemas/exam-slot.schema';
import { CreateExamSlotDto } from './dto/create-exam-slot.dto';
import { StudentsService } from '../students/students.service';

@Injectable()
export class ExamSlotsService {
  constructor(
    @InjectModel(ExamSlot.name) private examSlotModel: Model<ExamSlotDocument>,
    private studentsService: StudentsService,
  ) {}

  async create(createDto: CreateExamSlotDto): Promise<ExamSlotDocument> {
    const { date, time, capacity } = createDto;
    const newSlot = new this.examSlotModel({
      date: new Date(date),
      time,
      capacity: capacity ?? 1,
      isBooked: false,
      bookedByStudentId: null,
    });
    return newSlot.save();
  }

  async findAll(
    currentUser: any,
    showAll?: boolean,
  ): Promise<ExamSlotDocument[]> {
    const query: any = {};

    // For parents or default requests: only return unbooked slots
    // For staff, optionally return all slots if showAll is true
    if (currentUser.role !== 'admission_team' || !showAll) {
      query.isBooked = false;
    }

    return this.examSlotModel.find(query).exec();
  }

  async bookSlot(
    slotId: string,
    studentId: string,
    currentUser: any,
  ): Promise<ExamSlotDocument> {
    // 1. Find the slot
    const slot = await this.examSlotModel.findById(slotId).exec();
    if (!slot) {
      throw new NotFoundException(`Exam slot with ID "${slotId}" not found`);
    }

    if (slot.isBooked) {
      throw new BadRequestException('This exam slot is already booked');
    }

    // 2. Find student (this naturally validates parent ownership and existence)
    const student = await this.studentsService.findOne(studentId, currentUser);

    // 3. Verify student status is exactly REGISTRATION_FEE_PAID
    if (student.status !== 'REGISTRATION_FEE_PAID') {
      if (student.status === 'APPLICATION_CREATED') {
        throw new BadRequestException(
          'Registration fee must be paid before booking an exam slot.',
        );
      } else if (student.status === 'SLOT_BOOKED') {
        throw new BadRequestException(
          'Student has already booked an exam slot.',
        );
      } else {
        throw new BadRequestException(
          `Cannot book slot. Student application status is "${student.status}" instead of "REGISTRATION_FEE_PAID".`,
        );
      }
    }

    // 4. Update the slot atomically using query locking to prevent double booking
    const updatedSlot = await this.examSlotModel
      .findOneAndUpdate(
        { _id: slotId, isBooked: false },
        {
          isBooked: true,
          bookedByStudentId: new Types.ObjectId(studentId),
        },
        { new: true },
      )
      .exec();

    if (!updatedSlot) {
      throw new ConflictException(
        'This slot was just booked by another application. Please select a different slot.',
      );
    }

    // 5. Update the student profile
    try {
      student.status = 'SLOT_BOOKED';
      student.examSlot = {
        slotId: slotId,
        bookedAt: new Date(),
      };
      await student.save();
    } catch (error) {
      // ROLLBACK: Reset slot state to prevent inconsistency if saving student fails
      await this.examSlotModel
        .updateOne(
          { _id: slotId },
          {
            isBooked: false,
            bookedByStudentId: null,
          },
        )
        .exec();

      throw error;
    }

    return updatedSlot;
  }
}
