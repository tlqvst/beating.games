import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class getGamesRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;
}
