import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshAdminDto {
  @ApiProperty()
  @IsNotEmpty()
  refresh_token: string;
}
