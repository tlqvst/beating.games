import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { GameService } from './game.service';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from 'src/files/file.module';
import { FileService } from 'src/files/file.service';

@Module({
  imports: [ConfigModule, FileModule],
  exports: [GameService],
  providers: [GameService, PrismaService, UserService, FileService],
})
export class GameModule {}
