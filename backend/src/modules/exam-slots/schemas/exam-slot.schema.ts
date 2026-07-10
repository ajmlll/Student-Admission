import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

export type ExamSlotDocument = ExamSlot & Document;

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
export class ExamSlot {
  @Prop({ required: true })
  date!: Date;

  @Prop({ required: true, trim: true })
  time!: string;

  @Prop({ required: true, default: 1 })
  capacity!: number;

  @Prop({ required: true, default: false, index: true })
  isBooked!: boolean;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    required: true,
    default: [],
  })
  bookedStudentIds!: Types.ObjectId[];
}

export const ExamSlotSchema = SchemaFactory.createForClass(ExamSlot);
