import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsOptional()
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  MONGO_URI: string;

  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsNumber()
  ACCESS_TOKEN_EXPIRES_IN: number;

  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsNumber()
  REFRESH_TOKEN_EXPIRES_IN: number;
}
