import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly _jwtService: JwtService,
  ) {}

  async generateJwtToken(payload: object): Promise<string> {
    return this._jwtService.sign(payload, {
      issuer: process.env.JWT_ISSUER,
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.JWT_EXPIRES,
    });
  }

  async validateJwtUser(payload: object) {
    return await this._userService.findByPayload(payload);
  }
}
