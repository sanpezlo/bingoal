import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { JwtAuthGuard, LocalAuthGuard } from '@root/app/guards/auth.guard';
import { RolesGuard } from '@root/app/guards/roles.guard';
import { Role } from '@root/users/interfaces/user.interface';
import { IUnauthorized } from '@root/auth/interfaces/auth.interface';
import { Roles } from '@root/app/decorators/roles.decorator';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: IUnauthorized,
    }),
  );
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
