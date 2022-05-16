import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPost } from './interfaces/post.interface';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { PostCreateDto, UpdatePostDto } from './dto';
import { CategoryService } from 'src/category/category.service';

import * as mongoose from 'mongoose';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly _postModel: Model<IPost>,
    private readonly _categoryService: CategoryService,
  ) {}

  async createPost(
    postCreateDto: PostCreateDto,
    userId: string,
  ): Promise<IPost> {
    try {
      const categoryCheck = await this._categoryService.getCategoryById(
        postCreateDto.category,
      );
      if (!categoryCheck) {
        throw new HttpException(
          {
            success: false,
            status: 'Bad Request',
            msg: 'Sorry !!! this unknown category',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      let query: object = { title: postCreateDto.title, delete: false };
      const postCheck = await this._postModel.findOne(query);
      if (postCheck) {
        throw new HttpException(
          {
            success: false,
            status: 'Conflict',
            msg: 'Sorry !!! this post is already posted',
          },
          HttpStatus.CONFLICT,
        );
      }
      const createPost = new this._postModel(postCreateDto);
      createPost.owner = userId;

      return await createPost.save();
    } catch (error) {
      throw error;
    }
  }

  async getAllPost(): Promise<IPost[]> {
    try {
      let populateQuery = [
        { path: 'owner', select: 'fullName email contactNo address' },
        { path: 'category', select: 'title description' },
        {
          path: 'comments',
          populate: {
            path: 'owner',
            select: 'fullName email imageUrl',
          },
        },
      ];

      const posts = await this._postModel.find().populate(populateQuery).exec();

      if (posts.length === 0) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'Sorry !!! post records not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return posts;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string): Promise<IPost> {
    try {
      // console.log(id);
      let _id = new mongoose.Types.ObjectId(id);
      // console.log(_id)
      let populateQuery = [
        { path: 'owner', select: 'fullName email contactNo address imageUrl' },
        { path: 'category', select: 'title description' },
        {
          path: 'comments',
          match: {
            isApproved: true,
          },
          populate: {
            path: 'owner',
            select: 'fullName email imageUrl',
          },
        },
      ];
      const post = await this._postModel.findById(_id).populate(populateQuery);
      if (!post) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'Sorry !!! post records not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return post;
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<IPost> {
    try {
      let populateQuery = [
        { path: 'owner', select: 'fullName email contactNo address' },
        { path: 'category', select: 'title description' },
        {
          path: 'comments',
          match: {
            isApproved: true,
          },
          populate: {
            path: 'owner',
            select: 'fullName email imageUrl',
          },
        },
      ];
      let query: object = { slug, deleted: false };
      const post = await this._postModel.findOne(query).populate(populateQuery);
      if (!post) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'Sorry !!! post records not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return post;
    } catch (error) {
      throw error;
    }
  }

  async seenUnApprovedComment(slug: string): Promise<IPost> {
    try {
      let populateQuery = [
        { path: 'owner', select: 'fullName email contactNo address' },
        { path: 'category', select: 'title description' },
        {
          path: 'comments',
          // match: {
          //   isApproved: false,
          // },
          populate: {
            path: 'owner',
            select: 'fullName email imageUrl',
          },
        },
      ];
      let query: object = { slug, deleted: false };
      const post = await this._postModel.findOne(query).populate(populateQuery);
      if (!post) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'Sorry !!! post records not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return post;
    } catch (error) {
      throw error;
    }
  }

  async deletePost(id: string): Promise<IPost> {
    try {
      let _id = new mongoose.Types.ObjectId(id);

      const post = await this._postModel.findByIdAndRemove(_id);
      if (!post) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'Sorry !!! post records not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return post;
    } catch (error) {
      throw error;
    }
  }
  async updatePost(
    id: string,
    postUpdateDto: UpdatePostDto,
    userId: string,
    imageUrl: string,
  ): Promise<IPost> {
    try {
      let _id = new mongoose.Types.ObjectId(id);
      const post = await this._postModel.findByIdAndUpdate(_id, postUpdateDto, {
        new: true,
      });
      if (!post) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'Sorry !!! post records not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      post.updated_by = userId;
      post.updated_on = new Date();
      if (imageUrl) {
        post.imageUrl = imageUrl;
      }

      return await post.save();
    } catch (error) {
      throw error;
    }
  }
  async addComment(postId: string, commentId: string) {
    try {
      // should be called through comment service
      let _id = new mongoose.Types.ObjectId(postId);

      const commentRequest = await this._postModel.findByIdAndUpdate(
        _id,
        {
          $push: { comments: commentId },
        },
        { new: true, useFindAndModify: false },
      );
      if (!commentRequest) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'Sorry !!! there is no post available to comment',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return commentRequest;
    } catch (error) {
      throw error;
    }
  }

  async addCommentReplies(postId: string) {}
}
