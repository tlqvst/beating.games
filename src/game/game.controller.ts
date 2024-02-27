import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  Put,
  UploadedFile,
  UseInterceptors,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Game as GameModel } from '@prisma/client';
import { GameService } from './game.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { ListGamesResponseDto } from './dto/list-games-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReqUser } from 'src/types/ReqUser';
import { ListGamesRequestDto } from './dto/list-games-request.dto';
import { UpsertGameRequestDto } from './dto/upsert-game-request-dto';
import { log } from 'console';
import { Response } from 'express';
import { stringify } from 'csv-stringify/sync';

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('/:username')
  @ApiOperation({ summary: 'Get list of games for a user' })
  @ApiResponse({
    status: 200,
    description: 'List of games for the user',
    type: ListGamesResponseDto,
  })
  @ApiParam({ name: 'username', required: true, type: 'string' })
  async getGames(
    @Param('username') username: string,
    @Query() listGamesRequestDto?: ListGamesRequestDto,
  ): Promise<ListGamesResponseDto> {
    return this.gameService.gamesWithFilters(username, listGamesRequestDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('background'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new game' })
  async createGame(
    @Request() req,
    @Body() upsertGameRequestDto: UpsertGameRequestDto,
    @UploadedFile() background: Express.Multer.File,
  ): Promise<GameModel> {
    log(background.size);

    return await this.gameService.createGame(
      {
        ...upsertGameRequestDto,
        user: {
          connect: { id: req.user.userId },
        },
      },
      background,
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('background'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a game' })
  async updateGame(
    @Request() req,
    @Param('id') id: string,
    @Body() updateGameRequestDto: UpsertGameRequestDto,
    @UploadedFile() background: Express.Multer.File,
  ) {
    return this.gameService.updateGame(
      (req.user as ReqUser).userId,
      {
        where: { id: Number(id) },
        data: updateGameRequestDto,
      },
      background,
    );
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Game successfully deleted' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  @ApiResponse({ status: 403, description: 'Unauthorized user' })
  @ApiOperation({ summary: 'Delete a game' })
  async deleteGame(
    @Request() req,
    @Param('id') id: number,
  ): Promise<GameModel> {
    return this.gameService.deleteGame(Number(id), req.user.userId);
  }

  @Post('/export')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of games successfully exported',
  })
  @ApiResponse({ status: 403, description: 'Unauthorized user' })
  @ApiOperation({ summary: 'Export currently logged in users games' })
  async exportGamesCsv(@Request() req, @Res() res: Response): Promise<string> {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="games_export.csv"`,
    );

    const games = await this.gameService.exportGames(
      (req.user as ReqUser).userId,
    );

    res.send(
      stringify(games, {
        header: true,
      }),
    );

    return '';
  }
}
