import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard, LocalAuthGuard } from '@root/app/guards/auth.guard';
import { RolesGuard } from '@root/app/guards/roles.guard';
import { Role } from '@root/users/interfaces/user.interface';
import {
  IForbidden,
  IUnauthorized,
} from '@root/auth/interfaces/auth.interface';
import { Roles } from '@root/app/decorators/roles.decorator';
import { SocketAuthGuard } from '@root/app/guards/socket-auth.guard';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: IUnauthorized,
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
      type: IForbidden,
    }),
  );
}

export function SocketAuth() {
  return applyDecorators(UseGuards(SocketAuthGuard));
}

export function Login() {
  return applyDecorators(
    UseGuards(LocalAuthGuard),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: IUnauthorized,
    }),
  );
}
