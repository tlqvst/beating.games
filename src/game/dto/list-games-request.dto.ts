import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ListGamesRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  title?: string | undefined;

  @ApiProperty({ required: false })
  @IsOptional()
  system?: string | undefined;

  @ApiProperty({ required: false })
  @IsOptional()
  year?: string;

  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty({ required: false })
  owned?: boolean;

  @ApiProperty({ required: false })
  skip?: number = 0;

  @ApiProperty({ required: false })
  take?: number = 30;
}
