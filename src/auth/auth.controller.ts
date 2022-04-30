import { Body, Controller, HttpStatus, Next, Post, Res } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { IUser } from 'src/user/utils/user.interface';
import { AuthService } from './auth.services';
import { AuthLoginDto, AuthSignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _userService: UserService,
    private readonly _authService: AuthService,
  ) {}

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
