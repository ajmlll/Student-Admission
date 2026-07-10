'use inline';
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
      bookedStudentIds: [],
    });
    return newSlot.save();
  }

  async findAll(
    currentUser: any,
    showAll?: boolean,
  ): Promise<ExamSlotDocument[]> {
    const query: any = {};

    // For parents or default requests: only return unbooked slots (slots that have not reached capacity)
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

    if (slot.isBooked || slot.bookedStudentIds.length >= slot.capacity) {
      throw new BadRequestException('This exam slot is already fully booked');
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

    // 4. Update the slot atomically using query locking to prevent double booking beyond capacity
    const updatedSlot = await this.examSlotModel
      .findOneAndUpdate(
        {
          _id: slotId,
          isBooked: false,
        },
        {
          $push: { bookedStudentIds: new Types.ObjectId(studentId) },
        },
        { new: true },
      )
      .exec();

    if (!updatedSlot) {
      throw new ConflictException(
        'This slot was just booked by another application. Please select a different slot.',
      );
    }

    // Set isBooked = true if capacity is reached
    if (updatedSlot.bookedStudentIds.length >= updatedSlot.capacity) {
      updatedSlot.isBooked = true;
      await updatedSlot.save();
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
      // ROLLBACK: Remove student from slot array and reset isBooked state
      await this.examSlotModel
        .updateOne(
          { _id: slotId },
          {
            $pull: { bookedStudentIds: new Types.ObjectId(studentId) },
            isBooked: false,
          },
        )
        .exec();

      throw error;
    }

    return updatedSlot;
  }

  async remove(id: string): Promise<void> {
    const slot = await this.examSlotModel.findById(id).exec();
    if (!slot) {
      throw new NotFoundException(`Exam slot with ID "${id}" not found`);
    }
    if (slot.bookedStudentIds.length > 0) {
      throw new BadRequestException(
        'Cannot delete a slot that has already been booked by a student.',
      );
    }
    await this.examSlotModel.deleteOne({ _id: id }).exec();
  }

  async update(
    id: string,
    updateDto: Partial<CreateExamSlotDto>,
  ): Promise<ExamSlotDocument> {
    const slot = await this.examSlotModel.findById(id).exec();
    if (!slot) {
      throw new NotFoundException(`Exam slot with ID "${id}" not found`);
    }
    if (slot.bookedStudentIds.length > 0) {
      throw new BadRequestException(
        'Cannot edit a slot that has already been booked by a student.',
      );
    }

    if (updateDto.date !== undefined) {
      slot.date = new Date(updateDto.date);
    }
    if (updateDto.time !== undefined) {
      slot.time = updateDto.time;
    }
    if (updateDto.capacity !== undefined) {
      slot.capacity = updateDto.capacity;
    }

    return slot.save();
  }
}
