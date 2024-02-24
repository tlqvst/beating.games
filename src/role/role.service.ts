import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Role, Prisma } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async setupRoles(): Promise<void> {
    const roles = await this.prisma.role.findMany({
      where: { OR: [{ name: 'admin' }, { name: 'user' }] },
    });

    if (!roles.length) {
      try {
        await this.prisma.role.createMany({
          data: [
            { displayName: 'User', name: 'user' },
            { displayName: 'Admin', name: 'admin' },
          ],
        });
      } catch (error) {
        throw new Error(
          'Failed to setup initial user roles. Make sure DB is running',
        );
      }
    }
  }

  async role(
    roleWhereUniqueInput: Prisma.RoleWhereUniqueInput,
  ): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: roleWhereUniqueInput,
    });
  }

  async createRole(data: Prisma.RoleCreateInput): Promise<Role> {
    return this.prisma.role.create({
      data,
    });
  }
}
