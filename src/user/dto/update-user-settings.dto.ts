import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserSettingsDto {
  @ApiProperty()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  background: string;

  @ApiProperty()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  avatar: string;
}
