import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { Role } from 'src/user/entities/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    // does it have access ?
    // what is the require role?
    const requireRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // if routes doesn't contains metadata then return true
    if (!requireRoles) {
      return true;
    }

    // console.log(requireRoles, '--------------');
    const request: Express.Request = context.switchToHttp().getRequest();

    const user: any = request.user;

    return requireRoles.some((role) => user.role.includes(role));
  }
}
