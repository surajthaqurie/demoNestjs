import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NextFunction } from 'express';
import * as mongoose from 'mongoose';

type PostDocument = Post & mongoose.Document;

@Schema()
export class Post {
  @Prop({
    type: String,
    trim: true,
  })
  slug: string;

  @Prop({
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 50,
    required: true,
  })
  title: string;

  @Prop({
    type: String,
    trim: true,
    minlength: 10,
    // maxlength: 225,
    required: true,
  })
  content: string;

  // notice the brackets around the prop options
  // @Prop([{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }])
  // userId: mongoose.Types.ObjectId[];

  // notice the brackets around the prop options

  @Prop({
    type: String,
    ref: 'User',
    required: true,
  })
  owner: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: mongoose.Types.ObjectId;

  @Prop({ type: Date, required: true, default: new Date() })
  created_on: Date;

  @Prop({ type: String })
  imageUrl: string;

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

  @Prop([{ type: mongoose.SchemaTypes.ObjectId, ref: 'Comment' }])
  comments: mongoose.Types.ObjectId;
  
}

const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.pre('save', async function (this: PostDocument, next: NextFunction) {
  let post = this;

  post.slug = post.title
    .toLowerCase()
    .replace(/ /g, '_')
    .replace(/[^\w-]+/g, '');

  next();
});
export { PostSchema };
