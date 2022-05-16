import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Permission {
  @Prop({
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'PermissionResource',
    required: true,
  })
  resourceId: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    ref: 'User',
    required: true,
  })
  user: mongoose.Types.ObjectId;

  @Prop({
    type: Array,
  })
  access_control: string[];
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
