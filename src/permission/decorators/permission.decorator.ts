import { SetMetadata } from '@nestjs/common';
import { Permission } from '../enums/permission.enum';

export const Permissions = (...permissions: Permission[]) =>
  SetMetadata('permissions', permissions);
