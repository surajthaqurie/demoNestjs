import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './schemas/user.schema';
import { IUser } from './interfaces/user.interface';
import { AuthLoginDto, AuthSignupDto } from 'src/auth/dto';

import * as uuid from 'uuid';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly _userModel: Model<IUser>,
  ) {}

  #sanitizeUser(user: IUser) {
    return user.getUserInfo();
  }
  async userSignup(userSignupDto: AuthSignupDto): Promise<IUser> {
    try {
      let query: object = { email: userSignupDto.email /* , deleted: false */ };
      let userCheck = await this._userModel.findOne(query);
      if (userCheck) {
        throw new HttpException(
          {
            success: false,
            status: 'Conflict',
            msg: 'Sorry !!! this email address is already taken',
          },
          HttpStatus.CONFLICT,
        );
      }

      query = { contactNo: userSignupDto.contactNo /* , deleted: false */ };
      userCheck = await this._userModel.findOne(query);
      if (userCheck) {
        throw new HttpException(
          {
            success: false,
            status: 'Conflict',
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
            status: 'Bad Request',
            msg: 'Sorry !!! invalid credentials',
          },
          HttpStatus.NOT_FOUND,
        );
      }
<<<<<<< HEAD
      const passMatched = await user.verifyPassword(userLoginDto.password);
=======
      const passMatched = await user.comparePassword(userLoginDto.password);
>>>>>>> e396d83d1d22c9dc14b806f4f469c6aeef612803
      if (!passMatched) {
        throw new HttpException(
          {
            success: false,
            status: 'Bad Request',
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
    return await this._userModel
      .findOne({ uniqueId: payload.userId })
      .select('-password -uniqueId');
  }

  async getUserProfile(user: IUser): Promise<IUser> {
    try {
      if (!user) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'Sorry !!! user record not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
  async getAllUser(limit: number, skip: number): Promise<IUser[]> {
    try {
      const users = await this._userModel
        .find(
          { deleted: false },
          {
            fullName: 1,
            email: 1,
            contactNo: 1,
            imageUrl: 1,
            address: 1,
            city: 1,
            zipCode: 1,
            country: 1,
            created_on: 1,
          },
        )
        .limit(limit)
        .skip((skip - 1) * limit);
      if (users.length === 0) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'Sorry !!! users records not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return users;
    } catch (error) {
      throw error;
    }
  }
  async getAllDeletedUser(): Promise<IUser[]> {
    try {
      const users = await this._userModel.find(
        { deleted: true },
        {
          fullName: 1,
          email: 1,
          contactNo: 1,
          imageUrl: 1,
          address: 1,
          city: 1,
          zipCode: 1,
          country: 1,
          created_on: 1,
        },
      );
      if (users.length === 0) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'Sorry !!! users records not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return users;
    } catch (error) {
      throw error;
    }
  }

  async adminRemoveUser(id: string): Promise<IUser> {
    try {
      const user = await this._userModel
        .findByIdAndDelete(id)
        .select('-password -uniqueId');

      if (!user) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'User record not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async tempDeleteUser(user: IUser): Promise<IUser> {
    try {
      const query = { _id: user._id, deleted: false };
      const deletedUser = await this._userModel.findOneAndUpdate(
        query,
        {
          deleted: true,
          deleted_on: Date.now(),
          deleted_by: user.uniqueId,
        },
        {
          new: true,
        },
      );

      if (!deletedUser) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'User record not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return deletedUser;
    } catch (error) {
      throw error;
    }
  }
}
