import { Document } from 'mongoose';
import { Category } from 'src/category/schemas/category.schema';
import { Comment } from 'src/comment/schemas/comment.schema';
import { User } from 'src/user/schemas/user.schema';

export interface IPost extends Document {
  readonly id?: string;
  readonly title: string;
  readonly content: string;
  readonly category: Category;
  readonly created_on: Date;
  owner: string;
  imageUrl?: string;
  updated_by?: string;
  updated_on?: Date;
  readonly deleted: boolean;
  readonly deleted_on?: Date;
  readonly deleted_by?: string;
  readonly comments: Comment[];
}
