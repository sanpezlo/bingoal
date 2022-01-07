import { ApiProperty } from '@nestjs/swagger';

import { Token } from '@root/auth/schemas/token.schema';
import { timestamps } from '@root/app/config/database/schema';

export interface $Token extends Token {
  _id: string;
  [timestamps.createdAt]: Date;
  [timestamps.updatedAt]: Date;
}

export interface $RefreshPayload {
  sub: string;
  jti: string;
}

export interface $AccessPayload {
  sub: string;
}

export class IAuth {
  @ApiProperty({
    example: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTY4OTE4ODgzMTM5NjM1Yzg2MDVmOWIiLCJpYXQiOjE2MzQzMTUyMDIsImV4cCI6MTYzNDMxODgwMn0.ONPwn7t6vfswN4GbMjYXJ6phU7haB5nltlHJqLWJT2c',
  })
  access_token: string;

  @ApiProperty({
    example: 3600,
  })
  expires_in: number;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTY4OTE4ODgzMTM5NjM1Yzg2MDVmOWIiLCJqdGkiOiI2MTY4OTRhNjI1OTIyNjcyMTk4ZjFhNWMiLCJpYXQiOjE2MzQyNDM3NTA2MTMsImV4cCI6MTYzNDI0MzgzNzAxM30.Irpk8tCNl2h76PRn-tRLV_nJZRNR7i60qYD1EomtGRA',
  })
  refresh_token: string;

  @ApiProperty({
    example: 86400,
  })
  refresh_token_expires_in: number;
}

export class IUnauthorized {
  @ApiProperty({
    example: 401,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Unauthorized',
  })
  message: string;
}

export class IForbidden {
  @ApiProperty({
    example: 403,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Forbidden resource',
  })
  message: string;

  @ApiProperty({
    example: 'Forbidden',
  })
  error: string;
}
