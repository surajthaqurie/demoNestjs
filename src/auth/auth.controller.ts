import { Body, Controller, HttpStatus, Next, Post, Res } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { IUser } from 'src/user/utils/user.interface';
import { AuthLoginDto, AuthSignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _userService: UserService) {}

  @Post('signup')
  async authSignup(
    @Body() AuthSignupDto: AuthSignupDto,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const user = await this._userService.userSignup(AuthSignupDto);
      if (!user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to create user',
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        msg: 'User signed up successfully',
        user,
      });
    } catch (error) {
      return next(error);
    }
  }
}
