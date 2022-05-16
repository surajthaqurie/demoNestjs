import { Document } from 'mongoose';

export interface ICategory extends Document {
  readonly id?: string;
  readonly title: string;
  readonly description: string;
  readonly created_on: Date;
  owner: string;
  updated_by?: string;
  updated_on?: Date;
  readonly deleted: boolean;
  readonly deleted_on?: Date;
  readonly deleted_by?: string;
}
