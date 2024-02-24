import { Prisma, User } from '.prisma/client';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { UserSettings } from '@prisma/client';
import { ReqUser } from 'src/types/ReqUser';
import { PublicUserResponseDto } from './dto/public-user.dto';
import { FileService } from 'src/files/file.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async getUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async getProfile(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<PublicUserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include: {
        userSettings: true,
      },
    });

    if (!user) throw new NotFoundException();

    return {
      avatar: user.userSettings?.avatar,
      background: user.userSettings?.background,
      email: user.email,
      id: user.id,
      name: user.name,
      username: user.username,
    };
  }

  async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<void> {
    try {
      // Create the user
      const user = await this.prisma.user.create({
        data: {
          ...data,
          password: bcrypt.hashSync(data.password, 12),
          userSettings: {
            create: {
              avatar: null,
              background: null,
            },
          },
        },
      });

      // Find the 'user' role id
      const userRole = await this.prisma.role.findUnique({
        where: { name: 'user' },
      });

      // Assign the default user role
      await this.prisma.rolesOnUser.create({
        data: {
          roleId: userRole.id,
          userId: user.id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target: string = error.meta['target'].toString();
          // unique constraint
          throw new ConflictException(
            `${
              target.charAt(0).toUpperCase() + target.slice(1)
            } already in use`,
          );
        } else throw error;
      } else throw error;
    }
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;

    return this.prisma.user.update({
      data,
      where,
    });
  }

  async updateUserSettings(
    params: {
      where: Prisma.UserSettingsWhereUniqueInput;
      data: Prisma.UserSettingsUpdateInput;
    },
    background?: Express.Multer.File,
    avatar?: Express.Multer.File,
  ): Promise<UserSettings> {
    const { where, data } = params;

    const userSettings = await this.prisma.userSettings.findUnique({ where });

    if (!userSettings) throw new NotFoundException();

    let newBackground: string | null = null;
    let newAvatar: string | null = null;

    if (background) {
      newBackground = await this.fileService.saveBackground(background);
    }

    if (avatar) {
      newAvatar = await this.fileService.saveAvatar(avatar);
    }

    return this.prisma.userSettings.update({
      data: {
        ...data,
        background: newBackground ?? userSettings.background,
        avatar: newAvatar ?? userSettings.avatar,
      },
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  getLoggedInUserStatus(user?: ReqUser) {
    if (!user?.userId) return { isLoggedIn: false };

    return { isLoggedIn: true, ...user };
  }
}
