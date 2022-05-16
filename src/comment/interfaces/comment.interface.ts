import { Document } from 'mongoose';
import { ReplayComment } from '../schemas/replies.schema';

export interface IComment extends Document {
  readonly id?: string;
  readonly title: string;
  owner: string;
  readonly created_on: Date;
  readonly replies: ReplayComment[];
  readonly isApproved: boolean;
}
