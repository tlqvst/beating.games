import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Game, Prisma } from '@prisma/client';
import { ListGamesRequestDto } from './dto/list-games-request.dto';
import { FileService } from 'src/files/file.service';
import { ListGamesResponseDto } from './dto/list-games-response.dto';
import { EGameStatus } from 'src/types/TGameStatus';
import { isDateParseable } from 'src/utils/date';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
  ) {}

  async gamesWithFilters(
    username: string,
    listGamesRequestDto: ListGamesRequestDto,
  ): Promise<ListGamesResponseDto> {
    const { title, system, year, status, owned, skip, take } =
      listGamesRequestDto || {};

    const where: Prisma.GameWhereInput = {
      user: { username },
      title: { contains: title, mode: 'insensitive' },
      system: { contains: system, mode: 'insensitive' },
      date: year
        ? {
            // Constructing a range that encompasses the entire year
            gte: new Date(`${year}-01-01`), // Greater than or equal to January 1st of the year
            lt: new Date(`${parseInt(year) + 1}-01-01`), // Less than January 1st of the next year
          }
        : undefined,
      status: { equals: status, mode: 'insensitive' },
      owned: { equals: owned },
    };

    // Fetch games based on filters
    const filteredGames = await this.prisma.game.findMany({
      orderBy: {
        date: {
          sort: 'desc',
          nulls: 'last',
        },
      },
      where: Object.fromEntries(
        Object.entries(where).filter(([, value]) => value !== undefined),
      ),
      skip,
      take,
    });

    // Fetch total count of games with filters
    const totalGamesCount = await this.prisma.game.count({
      where: where,
    });

    // Fetch counts of games for each status type
    const statusCounts = await this.prisma.game.groupBy({
      by: ['status'],
      _count: true,
      where: where,
    });

    // Define initial values for each status type
    const initialStatusCountsMap = {
      [EGameStatus.BEATEN]: 0,
      [EGameStatus.CONTINUAL]: 0,
      [EGameStatus.DROPPED]: 0,
      [EGameStatus.IN_PROGRESS]: 0,
      [EGameStatus.WANT_TO_PLAY]: 0,
    };

    // Extract counts for each status type
    const statusCountsMap = statusCounts.reduce((acc, { status, _count }) => {
      acc[status] = _count;
      return acc;
    }, initialStatusCountsMap);

    return {
      take,
      total: totalGamesCount,
      beaten: statusCountsMap[EGameStatus.BEATEN],
      continual: statusCountsMap[EGameStatus.CONTINUAL],
      dropped: statusCountsMap[EGameStatus.DROPPED],
      inProgress: statusCountsMap[EGameStatus.IN_PROGRESS],
      wantToPlay: statusCountsMap[EGameStatus.WANT_TO_PLAY],
      games: filteredGames,
    };
  }

  async game(
    gameWhereUniqueInput: Prisma.GameWhereUniqueInput,
  ): Promise<Game | null> {
    return this.prisma.game.findUnique({
      where: gameWhereUniqueInput,
    });
  }

  async games(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.GameWhereUniqueInput;
    where?: Prisma.GameWhereInput;
    orderBy?: Prisma.GameOrderByWithRelationInput;
  }): Promise<Game[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.game.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createGame(
    data: Omit<Prisma.GameCreateInput, 'background'>,
    background: Express.Multer.File,
  ): Promise<Game> {
    const fileName = await this.fileService.saveGameArt(background);

    return this.prisma.game.create({
      data: {
        ...data,
        date: isDateParseable(data.date as string) ? data.date : null,
        background: fileName,
      },
    });
  }

  async updateGame(
    userId: number,
    params: {
      where: Prisma.GameWhereUniqueInput;
      data: Prisma.GameUpdateInput;
    },
    background?: Express.Multer.File,
  ): Promise<Game> {
    const game = await this.game(params.where);

    if (!game) throw new NotFoundException();
    if (game.userId !== userId) throw new UnauthorizedException();

    let fileName: string | null = null;

    if (background) {
      fileName = await this.fileService.saveGameArt(background);
    }

    return this.prisma.game.update({
      data: {
        ...params.data,
        date: isDateParseable(params.data?.date as string)
          ? params.data.date
          : null,
        background: background ? fileName : game.background,
      },
      where: params.where,
    });
  }

  async deleteGame(id: number, userId: number): Promise<Game> {
    const game = await this.game({ id: Number(id) });

    if (!game) throw new NotFoundException();

    if (game.userId !== userId) throw new UnauthorizedException();

    return this.prisma.game.delete({
      where: {
        id,
      },
    });
  }

  async exportGames(userId: number) {
    const user = this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException();

    const games = await this.prisma.game.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });

    return games.map((game) => ({
      addedOn: game.addedOn,
      date: game.date,
      title: game.title,
      system: game.system,
      // TODO: Improve handling image URLs
      background: Boolean(game.background)
        ? `${this.configService.get('BASE_URL')}/static/images/games/${
            game.background
          }`
        : '',
      playtime: game.playtime,
      status: game.status,
      content: game.content,
      owned: game.owned,
      achievementsLink: game.achievementsLink,
      perfectGame: game.perfectGame,
    }));
  }
}
