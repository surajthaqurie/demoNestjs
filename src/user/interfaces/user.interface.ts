import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly id?: string;
  readonly firstName: string;
  readonly lastName: string;
  password: string;
  readonly email: string;
  readonly contactNo: string;
  uniqueId: string;
  imageUrl?: string;
  readonly role?: string[];
  readonly address: string;
  readonly street?: string;
  readonly city?: string;
  readonly zipCode?: string;
  readonly country?: string;
  readonly terms_and_condition: boolean;
  readonly created_on: Date;
  created_by: string;
  updated_by?: string;
  updated_on?: Date;
  readonly deleted: boolean;
  readonly deleted_on?: Date;
  readonly deleted_by?: string;

  readonly getUserInfo: Function;
  readonly verifyPassword: Function;
}
