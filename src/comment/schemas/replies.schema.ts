import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class ReplayComment {
  @Prop({
    type: String,
    trim: true,
    maxlength: 255,
    required: true,
  })
  text: string;

  @Prop({
    type: String,
    ref: 'User',
    required: true,
  })
  owner: mongoose.Types.ObjectId;

  @Prop({ type: Date, required: true, default: new Date() })
  created_on: Date;
}
export const ReplyCommentSchema = SchemaFactory.createForClass(ReplayComment);
