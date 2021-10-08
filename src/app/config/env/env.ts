import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

import { EnvironmentVariables } from '@root/app/config/env/env.validation';

export const env = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  mongo: {
    uri: process.env.MONGO_URI,
  },
  token: {
    access: {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expires_in: parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN, 10) || 3600,
    },
    refresh: {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expires_in: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN, 10) || 86400,
    },
  },
});

export function envValidation(config: Record<string, unknown>) {
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
