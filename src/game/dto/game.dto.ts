import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  Max,
  IsBoolean,
  MinLength,
  IsOptional,
} from 'class-validator';

export class GameDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  addedOn: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  system: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  background: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Max(9999)
  playtime: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  content?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  owned: boolean;

  @ApiProperty()
  @MinLength(0)
  @MaxLength(200)
  @IsOptional()
  achievementsLink?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  perfectGame: boolean;

  @ApiProperty()
  userId: number;
}
