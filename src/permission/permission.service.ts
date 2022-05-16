import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { Model } from 'mongoose';
import { Permission } from './schemas/permission.schema';
import { PermissionResource } from './schemas/resources.schema';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name) private _permissionModel: Model<any>,
    @InjectModel(PermissionResource.name)
    private _permissionResourceModel: Model<any>,
  ) {}

  async createPermissionResource(
    createPermissionResourceDto: any,
    userId: string,
  ) {
    try {
      let query = {
        name: { $regex: createPermissionResourceDto.name, $options: 'i' },
      };
      const checkResource = await this._permissionResourceModel.findOne(query);
      if (checkResource) {
        throw new HttpException(
          {
            success: false,
            status: 'Conflict',
            msg: 'Sorry !!! this resource is already created',
          },
          HttpStatus.CONFLICT,
        );
      }

      const createResource = new this._permissionResourceModel(
        createPermissionResourceDto,
      );
      createResource.creator = userId;

      return await createResource.save();
    } catch (error) {
      throw error;
    }
  }

  async getAllResource() {
    try {
      const resources = await this._permissionResourceModel.find();

      if (!resources.length) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'Sorry !!! no resources records not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return resources;
    } catch (error) {
      throw error;
    }
  }

  async setPermission(createPermissionDto: any, resourceId: string) {
    try {
      let _id = new mongoose.Types.ObjectId(resourceId);

      if (createPermissionDto.access_control.includes('deny')) {
        const permissionRemove = await this._permissionModel.findOneAndRemove({
          user: createPermissionDto.user,
          resourceId: _id,
        });
        if (!permissionRemove) {
          throw new HttpException(
            {
              success: true,
              status: 'Bad Request',
              msg: 'This permission is unable remove',
            },
            HttpStatus.BAD_GATEWAY,
          );
        }
        return permissionRemove;
      } else {
        const checkResource = await this._permissionResourceModel.findById(_id);
        if (!checkResource) {
          throw new HttpException(
            {
              success: false,
              status: 'Not Found',
              msg: 'Sorry !!! no resources record not found',
            },
            HttpStatus.NOT_FOUND,
          );
        }

        const checkConflict = await this._permissionModel.findOne({
          user: createPermissionDto.user,
          resourceId: _id,
          access_control: { $all: createPermissionDto.access_control },
        });

        if (checkConflict) {
          throw new HttpException(
            {
              success: false,
              status: 'CONFLICT',
              msg: 'This permission is already assigned',
            },
            HttpStatus.CONFLICT,
          );
        }
        // check Employees id -------------

        const setPermission = new this._permissionModel(createPermissionDto);
        setPermission.resourceId = resourceId;

        return await setPermission.save();
      }
    } catch (error) {
      throw error;
    }
  }

  async getEmployeePermission(employeeId: string) {
    try {
      let _id = new mongoose.Types.ObjectId(employeeId);

      const getEmployeePermission = await this._permissionModel.find({
        user: _id,
      });
      if (!getEmployeePermission.length) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'Sorry !!! no permission records not found for this employee',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return getEmployeePermission;
    } catch (error) {
      throw error;
    }
  }

  async getAllPermission() {
    try {
      const permissions = await this._permissionModel
        .find()
        .populate('resourceId');
      if (!permissions.length) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'Sorry !!! no resources records not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return permissions;
    } catch (error) {
      throw error;
    }
  }

  async updatePermission(createPermissionDto: any, resourceId: string) {
    try {
      let _id = new mongoose.Types.ObjectId(resourceId);

      const checkResource = await this._permissionResourceModel.findById(_id);
      if (!checkResource) {
        throw new HttpException(
          {
            success: false,
            status: 'Not Found',
            msg: 'Sorry !!! no resources record not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // check Employees id -------------
      // const checkEmployee = await this._permissionResourceModel.findOne({
      //   user: createPermissionDto.userId,
      // });

      let query: object = { resourceId: _id, user: createPermissionDto.userId };
      const updatePermission = await this._permissionModel.findOneAndUpdate(
        query,
        {
          // $pull: { access_control: },
        },
        {
          $push: { access_control: createPermissionDto.access_control },
        },
      );

      const setPermission = new this._permissionModel(createPermissionDto);
      setPermission.resourceId = resourceId;

      return await setPermission.save();
    } catch (error) {
      throw error;
    }
  }

  /**************For Permission Guard*****************/
  async getPermission(userId: string, permissionResource: string[]) {
    try {
      let populateQuery = [
        { path: 'user', select: 'fullName email contactNo address imageUrl' },
        {
          path: 'resourceId',
          // match: {
          //   name: { $regex: permissionResource[0], $options: 'i' },
          // },
          select: 'name',
        },
      ];
      const getEmployeePermission = await this._permissionModel
        .find({
          user: userId,
        })
        .populate(populateQuery);

      // console.log(getEmployeePermission);

      // if (!getEmployeePermission.length) {
      //   throw new HttpException(
      //     {
      //       success: false,
      //       status: 'Not Found',
      //       msg: 'Sorry !!! employee record not found having permission',
      //     },
      //     HttpStatus.NOT_FOUND,
      //   );
      // }

      return getEmployeePermission;
    } catch (error) {
      throw error;
    }
  }

  /*********************** Testing ***********************/
  async approveComment() {
    return 'Im with permission guard';
  }
}
