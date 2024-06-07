import { Inject, Injectable } from '@nestjs/common';
import { UpdateAdminDto } from '../admin/dto/update-admin.dto';
import { HttpError } from 'src/common/exception/http.error';
import { decrypt, encrypt } from 'src/common/utils/hash/hashing.utils';
import { CreateAdminDto } from './dto/create-admin.dto';
import { GetAdminQueryDto } from './dto/get-admin-query.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { env } from 'src/common/config';
import { sign, verify } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import { RefreshAdminDto } from './dto/refresh-admin.dto';
import { Role } from 'src/common/auth/roles/role.enum';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from '../../common/database/schema';
import { desc, eq } from 'drizzle-orm';

@Injectable()
export class AdminService {
  constructor(@Inject('DB') private DB: MySql2Database<typeof schema>) {}

  async create(dto: CreateAdminDto) {
    const busyUsername = await this.DB.query.admin.findFirst({
      where: eq(schema.admin.username, dto.username),
    });
    if (busyUsername) HttpError({ code: 'BUSY_USERNAME' });

    const admin = await this.DB.insert(schema.admin).values({
      username: dto.username,
      full_name: dto.full_name,
      password: encrypt(dto.password),
    });
    return admin;
  }

  async delete(id: number) {
    const admin = await this.DB.query.admin.findFirst({ where: (admin, { eq }) => eq(admin.id, id) });
    if (!admin) HttpError({ code: 'ADMIN_NOT_FOUND' });
    return await this.DB.delete(schema.admin).where(eq(schema.admin.id, id));
  }

  async getAll(query: GetAdminQueryDto) {
    const { limit = 10, page = 1, full_name, username } = query;
    const [result, total] = await this.DB.query.admin.findMany({
      where: (admin, { like, or }) =>
        or(like(admin.full_name, `%${full_name.trim() || ''}%`), like(admin.username, `%${username.trim() || ''}%`)),

      offset: (page - 1) * limit,
      limit,
      orderBy: [desc(schema.admin.created_at)],
    });

    return { total, page, limit, data: result };
  }

  async getOne(id: number) {
    const admin = await this.DB.query.admin.findFirst({ where: eq(schema.admin.id, id) });
    if (!admin) HttpError({ code: 'ADMIN_NOT_FOUND' });
    return admin;
  }

  async login(dto: LoginAdminDto) {
    const admin = await this.DB.query.admin.findFirst({ where: eq(schema.admin.username, dto.username) });
    if (!admin) return HttpError({ code: 'ADMIN_NOT_FOUND' });

    const passwordMatch = dto.password === decrypt(admin.password);
    if (!passwordMatch) HttpError({ code: 'WRONG_PASSWORD' });

    const [access_token, refresh_token] = [
      sign({ id: admin.id, role: Role.Admin }, env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' }),
      sign({ id: admin.id, role: Role.Admin }, env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' }),
    ];

    await this.DB.update(schema.admin)
      .set({
        refresh_token: await hash(refresh_token, 10),
      })
      .where(eq(schema.admin.id, admin.id));

    return {
      ...admin,
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  async logout(id: number) {
    const admin = await this.DB.query.admin.findFirst({ where: eq(schema.admin.id, id) });
    if (!admin) HttpError({ code: 'ADMIN_NOT_FOUND' });
    admin.refresh_token = null;
    return await this.DB.update(schema.admin).set(admin).where(eq(schema.admin.id, id));
  }

  async refresh(dto: RefreshAdminDto) {
    const token = dto.refresh_token;
    const adminData = verify(token, env.REFRESH_TOKEN_SECRET) as { id: number; role: string };
    if (!adminData) HttpError({ code: 'LOGIN_FAILED' });

    const admin = await this.DB.query.admin.findFirst({ where: eq(schema.admin.id, adminData.id) });
    if (!admin) HttpError({ code: 'ADMIN_NOT_FOUND' });

    const isRefTokenMatch = await compare(dto.refresh_token, admin.refresh_token);
    if (!isRefTokenMatch) HttpError({ code: 'WRONG_REFRESH_TOKEN' });

    const access_token = sign({ id: admin.id, role: Role.Admin }, env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
    return { ...admin, access_token: access_token };
  }

  async update(id: number, dto: UpdateAdminDto) {
    const admin = await this.DB.query.admin.findFirst({ where: eq(schema.admin.id, id) });
    if (!admin) return HttpError({ code: 'ADMIN_NOT_FOUND' });

    for (const key in admin) {
      if (Object.prototype.hasOwnProperty.call(dto, key)) admin[key] = dto[key];
    }

    if (dto.new_password && !dto.old_password) HttpError({ code: 'ENTER_OLD_PASSWORD' });
    if (dto.old_password) {
      const isVerfied = decrypt(admin.password) == dto.old_password;
      if (!isVerfied) HttpError({ code: 'WRONG_OLD_PASSWORD' });
      if (!dto.confirm_password || !dto.new_password) HttpError({ message: 'NO_CONFIRM_OR_NEW_PASSWORD' });
      admin['password'] = encrypt(dto.new_password);
    }

    if (dto.username && dto.username !== admin.username) {
      const busyUsername = await this.DB.query.admin.findFirst({ where: eq(schema.admin.username, dto.username) });
      if (busyUsername) HttpError({ code: 'BUSY_USERNAME' });
    }

    return await this.DB.update(schema.admin).set(admin).where(eq(schema.admin.id, id));
  }
}
