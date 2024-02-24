import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { RoleModule } from './role/role.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GameController } from './game/game.controller';
import { GameModule } from './game/game.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './files/file.module';
import { MongoMigrationModule } from './mongomigration/mongomigration.module';

@Module({
  controllers: [GameController, AuthController, UserController],
  providers: [PrismaService],
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client', 'dist'),
      exclude: ['/api/(.*)', '/static(.*)'],
    }),
    AuthModule,
    UserModule,
    GameModule,
    RoleModule,
    FileModule,
    MongoMigrationModule,
  ],
})
export class AppModule {}
