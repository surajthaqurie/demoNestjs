import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionModule } from 'src/permission/permission.module';
import { PostModule } from 'src/post/post.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { ReplayComment, ReplyCommentSchema } from './schemas/replies.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([
      { name: ReplayComment.name, schema: ReplyCommentSchema },
    ]),
    PostModule,
    PermissionModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
