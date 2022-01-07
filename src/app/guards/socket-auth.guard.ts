import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

import { JwtStrategy } from '@root/auth/strategies/jwt.strategy';

@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor(private jwtStrategy: JwtStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client = context?.switchToWs()?.getClient<Socket>();
      if (client.data.user) return true;

      const user = await this.jwtStrategy.validate({
        sub: client.request['id'],
      });
      if (!user) return false;
      client.data.user = user;
      return true;
    } catch (error) {
      return false;
    }
  }
}
