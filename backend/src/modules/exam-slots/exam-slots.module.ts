import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamSlotsController } from './exam-slots.controller';
import { ExamSlotsService } from './exam-slots.service';
import { ExamSlot, ExamSlotSchema } from './schemas/exam-slot.schema';
import { StudentsModule } from '../students/students.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ExamSlot.name, schema: ExamSlotSchema }]),
    StudentsModule, // Required to use StudentsService for booking checks
  ],
  controllers: [ExamSlotsController],
  providers: [ExamSlotsService],
  exports: [ExamSlotsService],
})
export class ExamSlotsModule {}
