import {
  Injectable,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SocketValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      ...options,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        if (this.isDetailedOutputDisabled) {
          return new WsException(undefined);
        }
        const errors = this.flattenValidationErrors(validationErrors);
        return new WsException({ status: 'error', message: errors });
      },
    });
  }
}
