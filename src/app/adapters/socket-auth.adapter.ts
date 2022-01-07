import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

import { $AccessPayload } from '@root/auth/interfaces/auth.interface';

export class SocketAuthIoAdapter extends IoAdapter {
  private readonly jwtService: JwtService;
  constructor(private app: INestApplicationContext) {
    super(app);
    this.jwtService = this.app.get(JwtService);
  }
  createIOServer(port: number, options?: ServerOptions) {
    options.allowRequest = async (request, allowFunction) => {
      try {
        const authorization = request.headers.authorization;
        const [, schema, value] = authorization.match(/(\S+)\s+(\S+)/);
        if (schema !== 'Bearer' || !value)
          return allowFunction('Unauthorized', false);

        const $accessPayload = await this.jwtService.verify<$AccessPayload>(
          value,
        );
        request['id'] = $accessPayload.sub;
        return allowFunction(null, true);
      } catch (error) {
        return allowFunction('Unauthorized', false);
      }
    };
    return super.createIOServer(port, options);
  }
}
