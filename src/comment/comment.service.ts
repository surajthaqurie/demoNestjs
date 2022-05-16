import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schemas/comment.schema';
import { Model } from 'mongoose';
import { PostService } from 'src/post/post.service';
import { IComment } from './interfaces/comment.interface';
import * as mongoose from 'mongoose';

import { AddCommentDto, AddReplyCommentDto } from './dto';
import { ReplayComment } from './schemas/replies.schema';
import { IRepComment } from './interfaces/replies.interface';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private _commentModel: Model<IComment>,
    @InjectModel(ReplayComment.name)
    private _replayCommentModel: Model<IRepComment>,
    private readonly _postService: PostService,
  ) {} // :Promise<IComment>

  async addComment(
    commentCreateDto: AddCommentDto,
    postId: string,
    userId: string,
  ) {
    try {
      const postCheck = await this._postService.getById(postId);
      if (!postCheck) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'Sorry !!! post records not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const createComment = new this._commentModel(commentCreateDto);
      createComment.owner = userId;
      await createComment.save();

      return this._postService.addComment(postId, createComment._id);
    } catch (error) {
      throw error;
    }
  }
  async getCommentById(id: string) {
    let _id = new mongoose.Types.ObjectId(id);
    const checkComment = await this._commentModel.findById(_id);
    if (!checkComment) {
      throw new HttpException(
        {
          success: false,
          status: 'Not Found',
          msg: 'Sorry !!! there is no comment is available',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return checkComment;
  }

  /*********************** Permission Based ***********************/
  async makeApprovedComment(id: string) {
    let _id = new mongoose.Types.ObjectId(id);
    const commentApprovalRequest = await this._commentModel.findByIdAndUpdate(
      _id,
      {
        isApproved: true,
      },
      { new: true },
    );
    if (!commentApprovalRequest) {
      throw new HttpException(
        {
          success: false,
          status: 'Not Found',
          msg: 'Sorry !!! there is no comment is available',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return commentApprovalRequest;
  }

  async getUnApprovedComment() {
    const unApprovedComment = await this._commentModel.find({
      isApproved: false,
    });
    // console.log(unApprovedComment);

    if (!unApprovedComment.length) {
      throw new HttpException(
        {
          success: false,
          status: 'Not Found',
          msg: 'Sorry !!! there is no comment is available',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return unApprovedComment;
  }
  /**********************************************/

  async addCommentReplies(
    addCommentReplyDto: AddReplyCommentDto,
    commentId: string,
    userId: string,
  ) {
    let _id = new mongoose.Types.ObjectId(commentId);
    const checkComment = await this._commentModel.findOne({
      _id,
      isApproved: true,
    });
    if (!checkComment) {
      throw new HttpException(
        {
          success: false,
          status: 'Not Found',
          msg: 'Sorry !!! there is no comment is available',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const commentReply = new this._replayCommentModel(addCommentReplyDto);
    commentReply.owner = userId;
    await commentReply.save();

    const commentReplyRequest = await this._commentModel.findByIdAndUpdate(
      _id,
      {
        $push: { replies: commentReply._id },
      },
    );
    if (!commentReplyRequest) {
      throw new HttpException(
        {
          success: false,
          status: 'Not Found',
          msg: 'Sorry !!! there is no comment available to reply',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return commentReplyRequest;
  }

  /*--------- For Testing ---------*/
  async getAllComment() {
    const comments = await this._commentModel.find();
    if (comments.length === 0) {
      return 'no comment are available ';
    }

    return comments;
  }
  async getAllReplayComment() {
    const replyComments = await this._replayCommentModel.find();
    if (replyComments.length === 0) {
      return 'no comment are available ';
    }

    return replyComments;
  }
}
