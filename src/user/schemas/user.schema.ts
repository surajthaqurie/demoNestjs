import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NextFunction } from 'express';

import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
// import { Transform ,Exclude} from 'class-transformer';

type UserDocument = User & mongoose.Document;
@Schema()
export class User {
  // @Transform(({ value }) => value.toString())
  // _id: string;
  @Prop({
    type: String,
    trim: true,
  })
  fullName: string;

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
  })
  // @Exclude()
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

  @Prop({ type: [String], trim: true, required: true, default: ['user'] })
  role: string[];

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

  getUserInfo: Function;
  verifyPassword: Function;
}

const UserSchema = SchemaFactory.createForClass(User);

/************************************************* 
 * Adding a middleware before modeling the schema
@pre : doing some thing before users are 'save'
@post : doing some thing after users are 'save'
 */
UserSchema.pre('save', async function (this: UserDocument, next: NextFunction) {
  let user = this;
  if (!user.isModified('password')) return next();
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT));
  const hashPassword = await bcrypt.hash(user.password, salt);
  user.password = hashPassword;
  next();
});

UserSchema.pre('save', async function (this: UserDocument, next: NextFunction) {
  let user = this;
  if (!user.isModified('firstName') && !user.isModified('lastName'))
    return next();
  user.fullName = this.firstName + '' + this.lastName;
  next();
});

/*************************************************
 * Adding custom method for instance and individual document
 */
UserSchema.methods.getUserInfo = function (this: UserDocument): object {
  const user = this;
  const userObject = user.toObject();

  /* delete operator to delete object stuffs */
  // delete userObject.uniqueId;
  delete userObject.password;
  return userObject;
};

UserSchema.methods.verifyPassword = async function (
  this: UserDocument,
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export { UserSchema };
