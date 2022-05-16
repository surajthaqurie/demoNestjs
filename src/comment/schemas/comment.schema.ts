import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose from 'mongoose';

@Schema()
export class Comment {
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

  @Prop([{ type: mongoose.SchemaTypes.ObjectId, ref: 'ReplayComment' }])
  replies: mongoose.Types.ObjectId;

  @Prop({ type: Date, required: true, default: new Date() })
  created_on: Date;

  @Prop({ type: Boolean, default: false })
  isApproved: boolean;

  
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
