import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly id?: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly password: string;
  readonly email: string;
  readonly contactNo: string;
  uniqueId: string;
  readonly imageUrl?: string;
  readonly role?: string[];
  readonly address: string;
  /* street?: string; */
  readonly city?: string;
  readonly zipCode?: number;
  readonly country?: string;
  readonly terms_and_condition: boolean;
  readonly created_on: Date;
  created_by: string;
  readonly updated_by?: string;
  readonly updated_on?: Date;
  readonly deleted: boolean;
  readonly deleted_on?: Date;
  readonly deleted_by?: string;

<<<<<<< HEAD
  readonly comparePassword: Function;
  readonly getUserInfo: Function;
=======
  readonly getUserInfo: Function;
  readonly verifyPassword: Function;
>>>>>>> suraj
}
