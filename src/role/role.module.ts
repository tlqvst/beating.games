import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RoleService } from './role.service';

@Module({
  exports: [RoleService],
  providers: [RoleService, PrismaService],
})
export class RoleModule {}
