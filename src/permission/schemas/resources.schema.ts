import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class PermissionResource {
  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: String,
    ref: 'User',
    required: true,
  })
  creator: mongoose.Types.ObjectId;

  @Prop({ type: Date, required: true, default: new Date() })
  created_on: Date;

  @Prop({ type: Date })
  updated_on: Date;

  @Prop({ type: String })
  updated_by: string;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Date })
  deleted_on: Date;

  @Prop({ type: String })
  deleted_by: string;
}

export const PermissionResourceSchema =
  SchemaFactory.createForClass(PermissionResource);
