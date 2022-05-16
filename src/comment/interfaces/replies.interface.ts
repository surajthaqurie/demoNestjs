import { Document } from 'mongoose';

export interface IRepComment extends Document {
  readonly id?: string;
  readonly title: string;
  owner: string;
  readonly created_on: Date;
}
