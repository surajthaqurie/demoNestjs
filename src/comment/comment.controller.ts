import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Next,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtGuard, PermissionGuard, RolesGuard } from 'src/guard';
import { Permissions } from 'src/permission/decorators/permission.decorator';
import { PermissionResources } from 'src/permission/decorators/resource.decorator';
import { Permission } from 'src/permission/enums/permission.enum';
import { PermissionResource } from 'src/permission/enums/resources.enum';

import { Roles } from 'src/user/decorators/roles.decorator';
import { Role } from 'src/user/entities/role.enum';

import { CommentService } from './comment.service';
import { AddCommentDto, AddReplyCommentDto } from './dto';

@Controller('comment')
export class CommentController {
  constructor(private _commentService: CommentService) {}

  @UseGuards(JwtGuard)
  @Post(':id')
  async addComment(
    @Param('id') postId: string,
    @Body() commentCreateDto: AddCommentDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const userId = req.user['id'];

      const createdResponse = await this._commentService.addComment(
        commentCreateDto,
        postId,
        userId,
      );
      if (!createdResponse) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to comment',
        });
      }
      return res.status(HttpStatus.CREATED).json({
        success: true,
        status: 'Created',
        msg: 'Comment created successfully',
        comment: createdResponse,
      });
    } catch (error) {
      return next(error);
    }
  }

  @UseGuards(JwtGuard)
  @Post('reply/:id')
  async addReplyComment(
    @Param('id') commentId: string,
    @Body() replyCommentDto: AddReplyCommentDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const userId = req.user['id'];

      const createdResponse = await this._commentService.addCommentReplies(
        replyCommentDto,
        commentId,
        userId,
      );
      if (!createdResponse) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to reply',
        });
      }
      return res.status(HttpStatus.CREATED).json({
        success: true,
        status: 'Created',
        msg: 'Replied on comment successfully',
        replayComment: createdResponse,
      });
    } catch (error) {
      return next(error);
    }
  }

  @Get('single/:id')
  async getCommentById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    let populateQuery = [
      { path: 'owner', select: 'fullName email contactNo address' },
      {
        path: 'replies',
        populate: {
          path: 'owner',
          select: 'fullName email imageUrl',
        },
      },
    ];

    const getResponse = await (
      await this._commentService.getCommentById(id)
    ).populate(populateQuery);
    if (!getResponse) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        status: 'Bad Request',
        msg: 'Sorry !! something went wrong unable to get comment',
      });
    }
    return res.status(HttpStatus.CREATED).json({
      success: true,
      status: 'Success',
      msg: 'Getting comment successfully',
      comment: getResponse,
    });
  }

  /*********************** Permission Based ***********************/
  @Roles(Role.ADMIN)
  @Permissions(Permission.APPROVAL)
  @PermissionResources(PermissionResource.COMMENT)
  // @UseGuards(JwtGuard, RolesGuard, PermissionGuard)
  @UseGuards(JwtGuard, PermissionGuard) // PermissionGuard also used RolesGuard
  @Patch(':id')
  async makeCommentApproved(
    @Param('id') commentId: string,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const approvedResponse = await this._commentService.makeApprovedComment(
        commentId,
      );

      if (!approvedResponse) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to make comment approved',
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        status: 'Success',
        msg: 'Making comment approved successfully',
        comment: approvedResponse,
      });
    } catch (error) {
      return next(error);
    }
  }
  @Roles(Role.ADMIN)
  @Permissions(Permission.APPROVAL)
  @PermissionResources(PermissionResource.COMMENT)
  @UseGuards(JwtGuard, PermissionGuard)
  
  @Get('unApproved')
  async getUnApprovedComment(@Res() res: Response, @Next() next: NextFunction) {
    try {
      const getResponse = await this._commentService.getUnApprovedComment();
      if (!getResponse) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to make comment approved',
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        status: 'Success',
        msg: 'Making comment approved successfully',
        comment: getResponse,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**********************************************/

  /* --------------testing------------------ */
  @Get()
  async getAllComment(@Res() res: Response) {
    const getResponse = await this._commentService.getAllComment();
    if (getResponse.length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        status: 'Bad Request',
        msg: 'Sorry !! something went wrong unable to get comments',
      });
    }
    return res.status(HttpStatus.OK).json({
      success: true,
      status: 'Success',
      msg: 'Getting comment successfully',
      comment: getResponse,
    });
  }
  @Get('replies/all')
  async getAllReplayComment(@Res() res: Response) {
    const getResponse = await this._commentService.getAllReplayComment();
    if (getResponse.length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        status: 'Bad Request',
        msg: 'Sorry !! something went wrong unable to get comments',
      });
    }
    return res.status(HttpStatus.CREATED).json({
      success: true,
      status: 'Success',
      msg: 'Getting comment replies successfully',
      replyComment: getResponse,
    });
  }
}
