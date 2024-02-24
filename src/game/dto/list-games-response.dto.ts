import { ApiProperty } from '@nestjs/swagger';
import { GameDto } from './game.dto';

export class ListGamesResponseDto {
  @ApiProperty({ type: [GameDto] })
  games: GameDto[];

  @ApiProperty({ required: true })
  total: number;

  @ApiProperty({ required: true })
  take: number;

  @ApiProperty({ required: true })
  inProgress: number;

  @ApiProperty({ required: true })
  beaten: number;

  @ApiProperty({ required: true })
  dropped: number;

  @ApiProperty({ required: true })
  continual: number;

  @ApiProperty({ required: true })
  wantToPlay: number;
}
