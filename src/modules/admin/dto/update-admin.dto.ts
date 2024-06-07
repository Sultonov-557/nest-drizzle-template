import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class UpdateAdminDto {
  @ApiPropertyOptional({
    description: "Admin's username",
    type: 'string',
    title: 'username',
  })
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({
    description: "Admin's full name",
    type: 'string',
    title: 'full_name',
    default: 'admin',
  })
  @IsOptional()
  full_name?: string;

  @ApiPropertyOptional({
    description: "Admin's password",
    type: 'string',
    title: 'password',
  })
  @IsOptional()
  old_password?: string;

  @ApiPropertyOptional({
    description: 'New password',
    type: 'string',
    title: 'password',
  })
  @IsOptional()
  new_password?: string;

  @ApiPropertyOptional({
    description: 'Confirm password',
    type: 'string',
    title: 'password',
  })
  @IsOptional()
  confirm_password?: string;

  @ApiPropertyOptional({
    description: "Admin's role",
    type: 'string',
    title: 'role',
    enum: ['admin', 'operator', 'laborator', 'cashier'],
  })
  @IsOptional()
  @IsIn(['admin', 'operator', 'laborator', 'cashier'])
  type?: 'admin' | 'operator' | 'laborator' | 'cashier';

  @ApiPropertyOptional({
    description: "Laborator's laborator",
    type: 'number',
    title: 'laboratory_id',
    default: 1,
  })
  @IsOptional()
  laboratory_id?: number;
}
