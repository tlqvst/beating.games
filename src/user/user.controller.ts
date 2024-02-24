import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignupUserDto } from './dto/signup-user-request.dto';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { UserService } from './user.service';
import { UserSettings } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { ReqUser } from 'src/types/ReqUser';
import { PublicUserResponseDto } from './dto/public-user.dto';
import { GetLoggedInUserStatusDto } from './dto/get-logged-in-user-status.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/decorators/public';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:username')
  @ApiOperation({ summary: 'Gets a users public profile' })
  @ApiParam({ name: 'username', required: true, type: 'string' })
  @ApiResponse({
    status: 200,
    type: PublicUserResponseDto,
  })
  async getProfile(
    @Param('username') username: string,
  ): Promise<PublicUserResponseDto> {
    return this.userService.getProfile({
      username,
    });
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 409, description: 'Conflict (already exists)' })
  @ApiOperation({ summary: 'Registers a new user' })
  async signupUser(@Body() signupUserDto: SignupUserDto): Promise<void> {
    return this.userService.createUser(signupUserDto);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'background', maxCount: 1 },
    ]),
  )
  @ApiResponse({ status: 200, description: 'Successfully updated' })
  @ApiOperation({ summary: 'Updates currently logged in users settings' })
  async updateUserSettings(
    @Request() req,
    @Body() userSettings: UpdateUserSettingsDto,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      background?: Express.Multer.File[];
    },
  ): Promise<UserSettings> {
    return this.userService.updateUserSettings(
      {
        where: { userId: (req.user as ReqUser).userId },
        data: userSettings,
      },
      files.background?.[0],
      files.avatar?.[0],
    );
  }

  @Get()
  @Public()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gets information about logged in user' })
  @ApiResponse({
    status: 200,
    type: GetLoggedInUserStatusDto,
  })
  getLoginStatus(@Request() req): GetLoggedInUserStatusDto {
    return this.userService.getLoggedInUserStatus(req.user as ReqUser);
  }
}
