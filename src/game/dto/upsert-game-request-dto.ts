import { ApiProperty } from '@nestjs/swagger';
import { EGameStatus } from '../../types/TGameStatus';
import { IsIn, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ToBoolean } from 'src/transformers/to-boolean';

export class UpsertGameRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  @MaxLength(80)
  title: string;

  @ApiProperty()
  @MaxLength(80)
  system: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  background: string;

  @ApiProperty()
  playtime: number;

  @ApiProperty()
  @IsIn(Object.values(EGameStatus))
  status: string;

  @ApiProperty()
  @MaxLength(1000)
  content: string;

  @ApiProperty()
  @ToBoolean()
  owned: boolean;

  @ApiProperty()
  @MaxLength(200)
  achievementsLink: string;

  @ApiProperty()
  @ToBoolean()
  perfectGame: boolean;
}
