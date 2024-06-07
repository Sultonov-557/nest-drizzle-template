import { Controller, Post, Body, Get, Param, ParseIntPipe, Req, Query, Delete, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Role } from 'src/common/auth/roles/role.enum';
import { CoreApiResponse } from 'src/common/response/core.responce';
import { CreateAdminDto } from './dto/create-admin.dto';
import { GetAdminQueryDto } from './dto/get-admin-query.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { RefreshAdminDto } from './dto/refresh-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { AdminService } from './admin.service';

@ApiTags('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @DecoratorWrapper('Admin login qilish')
  async login(@Body() dto: LoginAdminDto) {
    return CoreApiResponse.success(await this.adminService.login(dto));
  }

  @Post('refresh')
  @DecoratorWrapper('Admin tokenni yangilash')
  async refresh(@Body() dto: RefreshAdminDto) {
    return CoreApiResponse.success(await this.adminService.refresh(dto));
  }

  @Post('logout')
  @DecoratorWrapper('Chiqish', true, [Role.Admin])
  async logout(@Req() req: Request) {
    return CoreApiResponse.success(await this.adminService.logout(req.user.id));
  }

  @Post()
  @DecoratorWrapper('Admin yaratish')
  async create(@Body() dto: CreateAdminDto) {
    return CoreApiResponse.success(await this.adminService.create(dto));
  }

  @Get()
  @DecoratorWrapper('Adminlarni olish', true, [Role.Admin])
  async getAll(@Query() dto: GetAdminQueryDto) {
    return CoreApiResponse.success(await this.adminService.getAll(dto));
  }

  @Get(':id')
  @DecoratorWrapper('Bitta adminni olish', true, [Role.Admin])
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return CoreApiResponse.success(await this.adminService.getOne(id));
  }

  @Delete(':id')
  @DecoratorWrapper("Adminni o'chirish", true, [Role.Admin])
  async delete(@Param('id', ParseIntPipe) id: number) {
    return CoreApiResponse.success(await this.adminService.delete(id));
  }

  @Patch(':id')
  @DecoratorWrapper('Adminni tahrirlash', true, [Role.Admin])
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAdminDto) {
    return CoreApiResponse.success(await this.adminService.update(id, dto));
  }
}
