import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NextFunction } from 'express';

import * as mongoose from 'mongoose';

type CategoryDocument = Category & mongoose.Document;

@Schema()
export class Category {
  @Prop({
    type: String,
    trim: true,
    minlength: 2,
    maxlength: 25,
    required: true,
  })
  title: string;

  @Prop({
    type: String,
    trim: true,
    minlength: 10,
    maxlength: 150,
    required: true,
  })
  description: string;

  @Prop({
    type: String, ref: 'User', required: true,
  })
  owner: mongoose.Types.ObjectId;

  @Prop({ type: Date, required: true, default: new Date() })
  created_on: Date;

  // @Prop({ type: String, required: true })
  // created_by: string;

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


export const CategorySchema = SchemaFactory.createForClass(Category);
