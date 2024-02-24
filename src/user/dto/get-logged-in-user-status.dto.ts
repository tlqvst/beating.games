import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetLoggedInUserStatusDto {
  @ApiProperty()
  isLoggedIn: boolean;

  @ApiProperty()
  @IsOptional()
  userId?: number;

  @ApiProperty()
  @IsOptional()
  username?: string;
}
