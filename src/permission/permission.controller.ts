import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Next,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtGuard, PermissionGuard, RolesGuard } from 'src/guard';
import { Permissions } from './decorators/permission.decorator';
import { Roles } from 'src/user/decorators/roles.decorator';
import { Role } from 'src/user/entities/role.enum';
import { PermissionService } from './permission.service';
import { Permission } from './enums/permission.enum';

import { CreatePermissionDto } from './dto';
import { PermissionResources } from './decorators/resource.decorator';
import { PermissionResource } from './enums/resources.enum';

@Controller('permission')
export class PermissionController {
  constructor(private _permissionService: PermissionService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('resources')
  async createResource(
    @Body() createPermissionResourceDto: any,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const userId = req.user['id'];

      const createdResponse =
        await this._permissionService.createPermissionResource(
          createPermissionResourceDto,
          userId,
        );

      if (!createdResponse) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to create resources',
        });
      }
      return res.status(HttpStatus.CREATED).json({
        success: true,
        status: 'Created',
        msg: 'Resource created successfully',
        resource: createdResponse,
      });
    } catch (error) {
      return next(error);
    }
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('set/:id')
  async setPermission(
    @Body() createPermissionDto: any,
    @Param('id') resourceId: string,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      // const userId = req.user['id']; here userId is in body
      const permissionGivenResponse =
        await this._permissionService.setPermission(
          createPermissionDto,
          resourceId,
        );
      if (!permissionGivenResponse) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to set permission to resources',
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        status: 'Success',
        msg: 'Permission is given to employee on resource successfully',
        resource: permissionGivenResponse,
      });
    } catch (error) {
      return next(error);
    }
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Get('emp/:id')
  async getEmployeePermission(
    @Param('id') employeeId: string,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const getResponse = await this._permissionService.getEmployeePermission(
        employeeId,
      );
      if (!getResponse.length) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to get resources',
        });
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        status: 'Success',
        msg: 'Getting employee permission successfully',
        permission: getResponse,
      });
    } catch (error) {
      return next(error);
    }
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Get('resources')
  async getAllResources(@Res() res: Response, @Next() next: NextFunction) {
    try {
      const getResponse = await this._permissionService.getAllResource();

      if (!getResponse.length) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to get resources',
        });
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        status: 'Success',
        msg: 'Getting permission resource successfully',
        resource: getResponse,
      });
    } catch (error) {
      return next(error);
    }
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  async getAllPermission(@Res() res: Response, @Next() next: NextFunction) {
    try {
      const getResponse = await this._permissionService.getAllPermission();

      if (!getResponse.length) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          status: 'Bad Request',
          msg: 'Sorry !! something went wrong unable to get permission',
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        status: 'Success',
        msg: 'Permission is given to employee on resource successfully',
        resource: getResponse,
      });
    } catch (error) {
      return next(error);
    }
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch()
  async updateEmployeePermission() {}

  /*********************** Testing ***********************/
  @UseGuards(JwtGuard, PermissionGuard)
  @Permissions(Permission.APPROVAL)
  @PermissionResources(PermissionResource.COMMENT)
  @Post('comment')
  async approveComment() {
    return this._permissionService.approveComment();
  }
}
