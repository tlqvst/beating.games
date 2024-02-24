import { Injectable } from '@nestjs/common';
import { log } from 'console';
import { readFileSync } from 'fs';
import { FileService } from 'src/files/file.service';
import { PrismaService } from 'src/prisma.service';

interface ImportedUser {
  username: string;
  password_hash: string;
  avatar: string;
  registerDate: string;
  email: string;
  background: string;
}

interface ImportedGame {
  _id: {
    $oid: string;
  };
  date: string;
  title?: string;
  system?: string;
  background?: string;
  playtime?: string;
  status: string;
  owned?: boolean;
  content?: string;
  user: string;
  perfectGame?: boolean;
  achievementsLink?: string;
}

@Injectable()
export class MongoMigrationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async migrateGames() {
    const games = readFileSync('games.json', 'utf-8');
    const parsedGames: ImportedGame[] = JSON.parse(games);

    for (const game of parsedGames) {
      log(game);
      let backgroundFile = null;

      if (Boolean(game.background)) {
        if (game.background.includes('base64')) {
          backgroundFile = await this.fileService.saveBase64GameArt(
            game.background,
          );
        } else {
          backgroundFile = await this.fileService.saveExternalGameArt(
            game.background,
          );
        }
      }

      const userGameBelongsTo = await this.prismaService.user.findFirst({
        where: {
          username: game.user,
        },
      });

      if (!userGameBelongsTo) continue;

      await this.prismaService.game.create({
        data: {
          achievementsLink: game.achievementsLink ?? null,
          background: backgroundFile ?? null,
          content: game.content ? this.truncateString(game.content, 900) : '',
          date: this.isDateParseable(game.date)
            ? new Date(game.date)
            : new Date(),
          owned: Boolean(game.owned),
          perfectGame: game.perfectGame ?? false,
          playtime: game.playtime ? parseInt(game.playtime) : null,
          system: game.system,
          title: game.title,
          addedOn: this.getDateFromMongoId(game._id.$oid),
          status: game.status,
          user: {
            connect: {
              username: game.user,
            },
          },
        },
      });
    }
  }

  async migrateUsers() {
    const users = readFileSync('users.json', 'utf-8');
    const parsedUsers: ImportedUser[] = JSON.parse(users);

    for (const user of parsedUsers) {
      let avatarFile = null;
      let backgroundFile = null;

      if (Boolean(user.avatar)) {
        avatarFile = await this.fileService.saveExternalAvatar(user.avatar);
      }

      if (Boolean(user.background)) {
        backgroundFile = await this.fileService.saveExternalBackground(
          user.background,
        );
      }

      const createdUser = await this.prismaService.user.create({
        data: {
          email: user.email,
          password: user.password_hash,
          username: user.username,
          name: user.username,
          userSettings: {
            create: {
              avatar: avatarFile,
              background: backgroundFile,
            },
          },
        },
      });

      // Find the 'user' role id
      const userRole = await this.prismaService.role.findUnique({
        where: { name: 'user' },
      });

      // Assign the default user role
      await this.prismaService.rolesOnUser.create({
        data: {
          roleId: userRole.id,
          userId: createdUser.id,
        },
      });
    }
  }

  private getDateFromMongoId(id: string) {
    // Convert hexadecimal string to numeric representation
    const timestamp = parseInt(id.substring(0, 8), 16);

    // Convert timestamp to Date object (multiply by 1000 to convert seconds to milliseconds)
    const date = new Date(timestamp * 1000);

    return date;
  }

  private isDateParseable(dateString: string): boolean {
    // Attempt to create a new Date object from the date string
    const parsedDate = new Date(dateString);

    // Check if the parsed date is a valid date
    // The getTime() method returns NaN for invalid dates
    return !isNaN(parsedDate.getTime());
  }

  private truncateString(str: string, maxLength: number): string {
    if (str.length <= maxLength) {
      return str; // No need to truncate
    } else {
      return str.substring(0, maxLength) + '...'; // Truncate and add ellipsis
    }
  }
}
