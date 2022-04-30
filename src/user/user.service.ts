import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './utils/user.schema';
import { IUser } from './utils/user.interface';
import { AuthLoginDto, AuthSignupDto } from 'src/auth/dto';

import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly _userModel: Model<IUser>,
  ) {}

  #sanitizeUser(user: IUser) {
    return user.depopulate('password');
  }
  async userSignup(userSignupDto: AuthSignupDto): Promise<IUser> {
    try {
      let query: object = { email: userSignupDto.email, deleted: false };
      let userCheck = await this._userModel.findOne(query);
      if (userCheck) {
        throw new HttpException(
          {
            success: false,
            status: HttpStatus.CONFLICT,
            msg: 'Sorry !!! this email address is already taken',
          },
          HttpStatus.CONFLICT,
        );
      }

      query = { contactNo: userSignupDto.contactNo, deleted: false };
      userCheck = await this._userModel.findOne(query);
      if (userCheck) {
        throw new HttpException(
          {
            success: false,
            status: HttpStatus.CONFLICT,
            msg: 'Sorry !!! this phone number is already taken',
          },
          HttpStatus.CONFLICT,
        );
      }

      const createUser = new this._userModel(userSignupDto);
      createUser.uniqueId = createUser.created_by = uuid.v4();
      await createUser.save();

      return this.#sanitizeUser(createUser);
    } catch (error) {
      throw error;
    }
  }

  async userLogin(userLoginDto: AuthLoginDto): Promise<IUser> {
    try {
      const query: object = {
        $or: [
          { email: userLoginDto.emailContact },
          { contactNo: userLoginDto.emailContact },
        ],
        deleted: false,
      };

      const user = await this._userModel.findOne(query);
      if (!user) {
        throw new HttpException(
          {
            success: false,
            status: HttpStatus.NOT_FOUND,
            msg: 'Sorry !!! invalid credentials',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      console.log(userLoginDto.password);
      console.log(user.password);

      const passMatched = await bcrypt.compare(
        userLoginDto.password,
        user.password,
      );

      if (!passMatched) {
        throw new HttpException(
          {
            success: false,
            status: HttpStatus.NOT_FOUND,
            msg: 'Sorry !!! invalid credentials',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return this.#sanitizeUser(user);
    } catch (error) {
      throw error;
    }
  }

  async findByPayload(payload: any) {
    console.log(payload);
    return await this._userModel.findOne({ uniqueId: payload.userId });
  }
}
