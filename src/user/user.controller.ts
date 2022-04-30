const { Controller, Get, Res, Req, Next } = require('@nestjs/common');
import { Delete, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { JwtGuard, RolesGuard } from '../guard';
import { GetUser } from './decorators';
import { UserService } from './user.service';
import { IUser } from './interfaces/user.interface';
import { Role } from './entities/role.enum';
import { Roles } from './decorators/roles.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @ApiOperation({
    summary: 'This api is used for get authenticated user profile',
  })
  @ApiBearerAuth('Authorization')
  @ApiOkResponse({
    description: 'Get user profile',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(
    @GetUser() user: IUser,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const userProfile = await this._userService.getUserProfile(user);
      if (!userProfile) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to get user profile',
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        status: 'Success',
        msg: 'Getting user profile successfully',
        userProfile,
      });
    } catch (error) {
      return next(error);
    }
  }

  @ApiOperation({
    summary: 'This api is used for get all users ',
  })
  // @ApiBearerAuth('Authorization')
  @ApiOkResponse({
    description: 'Get all users',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @Get()
  async getAllUser(@Res() res: Response, @Next() next: NextFunction) {
    try {
      const users = await this._userService.getAllUser();

      if (!users) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to get users',
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        status: 'Success',
        msg: 'Getting user profile successfully',
        users,
      });
    } catch (error) {
      next(error);
    }
  }

  @ApiOperation({
    summary: 'This api helps to admin to delete the user',
  })
  // @ApiBearerAuth('Authorization')
  // @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Delete user',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('Authorization')
  @Roles(Role.ADMIN)
  @Delete(':id')
  async adminRemoveUser(
    @Param('id') id: string,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const deletedUser = await this._userService.adminRemoveUser(id);
      if (!deletedUser) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to delete user',
        });
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        status: 'Success',
        msg: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
