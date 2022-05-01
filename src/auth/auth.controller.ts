import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Next,
  Post,
  Param,
  Query,
  Res,
  UseInterceptors,
  ParseArrayPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';

import { NextFunction, Response } from 'express';
import { AppInterceptor } from '../interceptor';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.services';
import { AuthLoginDto, AuthSignupDto } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly _userService: UserService,
    private readonly _authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'This api is used for signup user',
  })
  @ApiCreatedResponse({
    description: 'Signup success',
  })
  @ApiConflictResponse({ description: 'Conflict Response' })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  /**************************************************/
  @Post('signup')
  async authSignup(
    @Body() authSignupDto: AuthSignupDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const user = await this._userService.userSignup(authSignupDto);
      if (!user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to create user',
        });
      }

      const payload = {
        userId: user.uniqueId,
        role: user.role,
      };

      const token = await this._authService.generateJwtToken(payload);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        status: 'Created',
        msg: 'User signed up successfully',
        token,
      });
    } catch (error) {
      return next(error);
    }
  }

  @ApiOperation({
    summary: 'This api is used for login in to the system',
  })
  @ApiOkResponse({
    description: 'Login success',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @Post('login')
  /**************************************************/
  async authLogin(
    @Body() authLoginDto: AuthLoginDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const user = await this._userService.userLogin(authLoginDto);
      console.log(user);
      if (!user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to login',
        });
      }
      const payload = {
        userId: user.uniqueId,
        role: user.role,
      };

      const token = await this._authService.generateJwtToken(payload);

      return res.status(HttpStatus.OK).json({
        success: true,
        status: 'Success',
        msg: 'User login successfully',
        token,
      });
    } catch (error) {
      return next(error);
    }
  }

  /******************** Testing ********************/
  // UseInterceptors And Pipe
  @UseInterceptors(AppInterceptor)
  @Get('post')
  postList(): object {
    console.log('api call');
    return {
      data: 'Post list',
    };
  }
  @Post('post/:id')
  @HttpCode(404)
  // ############# Normal case ##################
  // detailById(@Param('id',new ParseIntPipe) id: number): string {
  //   return 'list user' + id;
  // }

  // detailById(
  //   @Param(
  //     'id',
  //     new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
  //   )
  //   id: number,
  // ): string {
  //   return 'list user' + id;
  // }

  // ############# Query default value ##################
  // detailById(
  //   @Query('page', new DefaultValuePipe(4))
  //   page: number,
  // ): string {
  //   return 'list user' + page;
  // }
  // ############# Query in array id=123,6546 value ##################
  detailById(
    @Query('id', new ParseArrayPipe({ items: Number, separator: ',' }))
    id: number[],
  ): string {
    return 'list user' + id;
  }
}
