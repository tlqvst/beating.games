import { IsNumber, IsString } from 'class-validator';

export class AccessTokenPayloadDto {
  @IsString()
  username: string;

  @IsNumber()
  sub: number;
}
