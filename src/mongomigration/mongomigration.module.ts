import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoMigrationService } from './mongomigration.service';
import { PrismaService } from 'src/prisma.service';
import { FileService } from 'src/files/file.service';

@Module({
  imports: [ConfigModule],
  exports: [MongoMigrationService],
  providers: [MongoMigrationService, PrismaService, FileService],
})
export class MongoMigrationModule {}
