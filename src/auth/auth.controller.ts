import { Body, Controller, HttpStatus, Next, Post, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { NextFunction, Response } from 'express';
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

      return res.status(HttpStatus.OK).json({
        success: true,
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
  async authLogin(
    @Body() authLoginDto: AuthLoginDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const user = await this._userService.userLogin(authLoginDto);

    const payload = {
      userId: user.uniqueId,
      role: user.role,
    };

    const token = await this._authService.generateJwtToken(payload);

    return res.status(HttpStatus.OK).json({
      success: true,
      msg: 'User login successfully',
      token,
    });
  }
}
