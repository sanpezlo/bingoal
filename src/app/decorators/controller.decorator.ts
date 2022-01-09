import { applyDecorators, Controller as $Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function Controller(name: string) {
  return applyDecorators(ApiTags(name), $Controller(name));
}
