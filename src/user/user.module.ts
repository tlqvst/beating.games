import { Module } from '@nestjs/common';
import { FileModule } from 'src/files/file.module';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [FileModule],
  exports: [UserService],
  providers: [UserService, PrismaService],
})
export class UserModule {}
