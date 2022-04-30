import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NextFunction } from 'express';

import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & mongoose.Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class User {
  @Prop({
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 25,
    required: true,
  })
  firstName: string;

  @Prop({
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 25,
    required: true,
  })
  lastName: string;

  @Prop({
    type: String,
    trim: true,
    minlength: 8,
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    type: String,
    trim: true,
    minlength: 7,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    trim: true,
    minlength: 10,
    maxlength: 10,
    required: true,
    unique: true,
  })
  contactNo: string;

  @Prop({ type: String, trim: true, required: true, unique: true })
  uniqueId: string;

  @Prop({ type: String, trim: true })
  imageUrl: string;

  @Prop({ type: String, trim: true, required: true, default: 'user' })
  role: string;

  @Prop({
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 50,
    required: true,
  })
  address: string;

  // @Prop({ type: String, minlength: 5, maxlength: 50, trim: true })
  // street: string;

  @Prop({ type: String, minlength: 5, maxlength: 50, trim: true })
  city: string;

  @Prop({ type: Number, minlength: 2 })
  zipCode: number;

  @Prop({ type: String, minlength: 5, maxlength: 50, trim: true })
  country: string;

  @Prop({ type: Boolean, default: true })
  terms_and_condition: boolean;

  @Prop({ type: Date, required: true, default: new Date() })
  created_on: Date;

  @Prop({ type: String, required: true })
  created_by: string;

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

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('fullName').get(function (this: UserDocument) {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.pre('save', async function (this: UserDocument, next: NextFunction) {
  let user = this;
  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT));
  const hashPassword = await bcrypt.hash(user.password, salt);

  user.password = hashPassword;

  next();
});

UserSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export { UserSchema };
