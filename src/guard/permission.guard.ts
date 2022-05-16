import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request as ExpressRequest } from 'express';
import { PermissionService } from 'src/permission/permission.service';
import { RolesGuard } from './role.guard';

@Injectable()
export class PermissionGuard extends RolesGuard implements CanActivate {
  constructor(
    private _reflector: Reflector,
    private _permissionService: PermissionService,
  ) {
    super(_reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirePermission = this._reflector.getAllAndOverride('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);

    const permissionResource = this._reflector.getAllAndOverride('resources', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requirePermission.length) {
      // return true;
      return super.canActivate(context) || true;
    }

    const { user } = context.switchToHttp().getRequest() as ExpressRequest;
    const userId = user['_id'];

    // console.log(userId);
    
    const permissionAccess: any = await this._permissionService.getPermission(
      userId,
      permissionResource,
    );

    if (!permissionAccess.length) {
      // return false;
      return super.canActivate(context) || false;
    }

    const filterResourceArray = permissionAccess.filter((f: any) => {
      return (
        f.resourceId.name.toString().toLowerCase() ===
        permissionResource.toString().toLowerCase()
      );
    });

    // console.log(filterResourceArray);
    const filterPermissionArray = filterResourceArray.filter((f: any) => {
      return (
        f.access_control.toString().toLowerCase() ===
        requirePermission.toString().toLowerCase()
      );
    });

    // console.log(!!filterPermissionArray.length);

    return !!filterPermissionArray.length || super.canActivate(context);
  }
}

/* 
[
 {
    _id: new ObjectId("62810c8ebd1a44fd2043291b"),
    user: {
      _id: new ObjectId("6280a1f51885afd936654f2e"),
      email: 'employee@gmail.com',
      contactNo: '2222222222',
      address: 'ktm nepal',
      fullName: 'employee employee'
    },
    access_control: [ 'approve' ], approve
    resourceId: { _id: new ObjectId("62810c4bbd1a44fd20432916"), name: 'Comment' },
    __v: 0
  },
  {
    _id: new ObjectId("62810cd2bd1a44fd20432929"),
    user: {
      _id: new ObjectId("6280a1f51885afd936654f2e"),
      email: 'employee@gmail.com',
      contactNo: '2222222222',
      address: 'ktm nepal',
      fullName: 'employee employee'
    },
    access_control: [ 'deny' ],
    resourceId: { _id: new ObjectId("62810cbfbd1a44fd20432924"), name: 'Post' },
    __v: 0
  }
]
*/
