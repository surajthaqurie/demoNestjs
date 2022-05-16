import { SetMetadata } from '@nestjs/common';
import { PermissionResource } from '../enums/resources.enum';

export const PermissionResources = (...resources: PermissionResource[]) =>
  SetMetadata('resources', resources);
