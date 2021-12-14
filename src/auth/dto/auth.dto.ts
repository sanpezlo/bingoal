import { IsEmail, IsJWT, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'example@mail.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'password',
  })
  password: string;
}

export class RefreshDto {
  @IsNotEmpty()
  @IsJWT()
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTY4OTE4ODgzMTM5NjM1Yzg2MDVmOWIiLCJqdGkiOiI2MTY4OTRhNjI1OTIyNjcyMTk4ZjFhNWMiLCJpYXQiOjE2MzQyNDM3NTA2MTMsImV4cCI6MTYzNDI0MzgzNzAxM30.Irpk8tCNl2h76PRn-tRLV_nJZRNR7i60qYD1EomtGRA',
  })
  refresh: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'password',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'new password',
  })
  newPassword: string;
}
