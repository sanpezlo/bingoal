import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, validateSync } from 'class-validator';

import envEnum from '@root/app/config/env.enum';

class EnvironmentVariables {
  @IsOptional()
  @IsEnum(envEnum)
  NODE_ENV: envEnum;

  @IsNumber()
  PORT: number;
}

export default function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
