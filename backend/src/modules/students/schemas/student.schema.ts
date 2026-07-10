import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

export type StudentDocument = Student & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret: any) => {
      ret.id = ret._id?.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Student {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  parentId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  studentName!: string;

  @Prop({ required: true })
  dateOfBirth!: Date;

  @Prop({
    required: true,
    enum: ['male', 'female', 'other'],
  })
  gender!: 'male' | 'female' | 'other';

  @Prop({ required: false, trim: true })
  previousSchool?: string;

  @Prop({
    required: true,
    enum: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'],
  })
  applyingGrade!: 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4';

  @Prop({
    required: true,
    enum: [
      'APPLICATION_CREATED',
      'REGISTRATION_FEE_PAID',
      'SLOT_BOOKED',
      'EXAM_COMPLETED',
      'ADMISSION_COMPLETED',
    ],
    default: 'APPLICATION_CREATED',
    index: true,
  })
  status!:
    | 'APPLICATION_CREATED'
    | 'REGISTRATION_FEE_PAID'
    | 'SLOT_BOOKED'
    | 'EXAM_COMPLETED'
    | 'ADMISSION_COMPLETED';

  // Placed fields for later modules
  @Prop({
    type: {
      paid: { type: Boolean, default: false },
      paidAt: { type: Date, required: false },
    },
    default: { paid: false },
    _id: false,
  })
  registrationFee?: {
    paid: boolean;
    paidAt?: Date;
  };

  @Prop({
    type: {
      slotId: { type: String, required: false },
      bookedAt: { type: Date, required: false },
    },
    required: false,
    default: undefined,
    _id: false,
  })
  examSlot?: {
    slotId?: string;
    bookedAt?: Date;
  };

  @Prop({ type: Number, required: false })
  examScore?: number;

  @Prop({ type: String, required: false })
  assignedCourse?: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
export type StudentMongooseModel = mongoose.Model<StudentDocument>;
