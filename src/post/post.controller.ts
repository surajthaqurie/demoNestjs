import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Next,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtGuard, PermissionGuard, RolesGuard } from 'src/guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { Role } from 'src/user/entities/role.enum';
import { PostCreateDto, UpdatePostDto } from './dto';
import { PostService } from './post.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { imageUpload } from '../helpers/file.helper';

import { Permissions } from 'src/permission/decorators/permission.decorator';
import { Permission } from 'src/permission/enums/permission.enum';
import { PermissionResources } from 'src/permission/decorators/resource.decorator';
import { PermissionResource } from 'src/permission/enums/resources.enum';
@Controller('post')
export class PostController {
  constructor(private readonly _postService: PostService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async createPost(
    @Req() req: Request,
    @Body() postCreateDto: PostCreateDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const userId = req.user['id'];
      const createResponse = await this._postService.createPost(
        postCreateDto,
        userId,
      );
      if (!createResponse) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to create post',
        });
      }
      return res.status(HttpStatus.CREATED).json({
        success: true,
        status: 'Created',
        msg: 'post created successfully',
        post: createResponse,
      });
    } catch (error) {
      return next(error);
    }
  }

  @Get()
  async getAllPost(@Res() res: Response, @Next() next: NextFunction) {
    try {
      const getResponse = await this._postService.getAllPost();
      if (getResponse.length < 1) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to get posts',
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        status: 'success',
        msg: 'Getting all post successfully',
        posts: getResponse,
      });
    } catch (error) {
      return next(error);
    }
  }
  @Get(':id')
  async findById(
    @Param('id') id: string,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const getResponse = await this._postService.getById(id);
      if (!getResponse) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to get post',
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        status: 'success',
        msg: 'Getting post successfully',
        posts: getResponse,
      });
    } catch (error) {
      return next(error);
    }
  }

  @Get('slug/:slug')
  async findBySlug(
    @Param('slug') slug: string,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const getResponse = await this._postService.findBySlug(slug);
      if (!getResponse) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to get post',
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        status: 'success',
        msg: 'Getting post successfully',
        posts: getResponse,
      });
    } catch (error) {
      return next(error);
    }
  }

  @Roles(Role.ADMIN,Role.EMPLOYEE)
  // @Permissions(Permission.APPROVAL)
  // @PermissionResources(PermissionResource.COMMENT)
  // @UseGuards(JwtGuard, PermissionGuard)

  @Get('slug/unapproved/:slug')
  async seenUnApprovedComment(
    @Param('slug') slug: string,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const getResponse = await this._postService.seenUnApprovedComment(slug);
      if (!getResponse) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to get post',
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        status: 'success',
        msg: 'Getting post successfully',
        posts: getResponse,
      });
    } catch (error) {
      return next(error);
    }
  }
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name = file.originalname
            .split('.')[0]
            // .replace(' ', '')
            .toLowerCase();
          const fileExtension = file.originalname.split('.')[1];
          const newFileName =
            name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;

          cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(null, false);
        }
        cb(null, true);
      },
    }),
  )
  @Post('upload-photo/:id')
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      if (file) {
        const post = await this._postService.getById(id);
        if (post) {
          post.imageUrl = `${process.env.DEV_URL}/post/pictures/${file.filename}`;
          post.save();

          return res.status(HttpStatus.OK).json({
            success: true,
            status: 'Success',
            post,
          });
        }
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to get post',
        });
      } else {
        // throw new BadRequestException('file is not a image');
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'file is not a image',
        });
      }
    } catch (error) {
      return next(error);
    }
  }
  @Get('pictures/:filename')
  async getPicture(
    @Param('filename') filename: string,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      res.sendFile(filename, {
        root: './uploads',
      });
    } catch (error) {
      next(error);
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deletePost(
    @Param('id') id: string,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const deletedResponse = await this._postService.deletePost(id);
      if (!deletedResponse) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to delete post',
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        status: 'success',
        msg: 'Post deleted successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file', imageUpload))
  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body() postUpdateDto: UpdatePostDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      let imageUrl: string = '';
      if (file) {
        imageUrl = `${process.env.DEV_URL}/post/pictures/${file.filename}`;
      }
      const userId = req.user['id'];
      const updateResponse = await this._postService.updatePost(
        id,
        postUpdateDto,
        userId,
        imageUrl,
      );

      if (!updateResponse) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to update post',
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        status: 'success',
        msg: 'Post updated successfully',
        post: updateResponse,
      });
    } catch (error) {
      throw next(error);
    }
  }
}
