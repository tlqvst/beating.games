import { Injectable } from '@nestjs/common';
import * as mimeTypes from 'mime-types';
import { copyFileSync, createWriteStream } from 'fs';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { randomUUID } from 'crypto';
import { normalize } from 'path';
import { writeFile } from 'fs/promises';
import * as sharp from 'sharp';

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {}

  async saveAvatar(avatar: Express.Multer.File) {
    return await this.saveFile(avatar, 'AVATAR', {
      width: 600,
      height: 600,
    });
  }

  async saveBackground(background: Express.Multer.File) {
    return await this.saveFile(background, 'BACKGROUND', {
      width: 2560,
      height: 1440,
    });
  }

  async saveGameArt(gameArt: Express.Multer.File) {
    return await this.saveFile(gameArt, 'GAME', {
      width: 1280,
      height: 720,
    });
  }

  async saveExternalAvatar(avatar: string) {
    return await this.saveExternalImage(avatar, 'AVATAR');
  }

  async saveExternalBackground(background: string) {
    return await this.saveExternalImage(background, 'BACKGROUND');
  }

  async saveExternalGameArt(gameArt: string) {
    return await this.saveExternalImage(gameArt, 'GAME');
  }

  async saveBase64Avatar(avatar: string) {
    return await this.saveBase64Image(avatar, 'AVATAR');
  }

  async saveBase64Background(background: string) {
    return await this.saveBase64Image(background, 'BACKGROUND');
  }

  async saveBase64GameArt(gameArt: string) {
    return await this.saveBase64Image(gameArt, 'GAME');
  }

  private async saveFile(
    file: Express.Multer.File,
    fileType: 'AVATAR' | 'BACKGROUND' | 'GAME',
    optimizeImageOptions: IOptimizeImageOptions,
  ) {
    const optimizedImage = await this.optimizeImage(file, optimizeImageOptions);

    const extension = mimeTypes.extension(optimizedImage.mimetype);

    const backgroundId = randomUUID();

    const fileName = `${backgroundId}.${extension}`;

    await writeFile(
      normalize(
        `${this.configService.get(
          'STATIC_ROOT_DIRECTORY',
        )}/${this.configService.get(
          `STATIC_${fileType}_DIRECTORY`,
        )}/${fileName}`,
      ),
      optimizedImage.buffer,
    );

    return fileName;
  }

  private async saveExternalImage(
    url: string,
    fileType: 'AVATAR' | 'BACKGROUND' | 'GAME',
  ): Promise<string> {
    const fileId = randomUUID();

    let response: AxiosResponse | null = null;

    response = await axios.get(url, {
      responseType: 'stream',
    });

    const tempFilePath = normalize(
      `${this.configService.get(
        'STATIC_ROOT_DIRECTORY',
      )}/${this.configService.get('STATIC_TEMP_DIRECTORY')}/`,
    );

    // Get file extension, remove query strings
    const fileExtensionRegex = /\.(png|jpg|jpeg|gif|webp)(?=(.*))/;

    const fileExtensionMatches = url.match(fileExtensionRegex);

    if (!fileExtensionMatches) return;

    const fileExtension = fileExtensionMatches[0];

    const fileNameWithExtension = `${fileId}.${fileExtension}`;

    const file = `${tempFilePath}/${fileNameWithExtension}`;

    const writer = createWriteStream(normalize(file));

    await new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const newFilePath = normalize(
      `${this.configService.get(
        'STATIC_ROOT_DIRECTORY',
      )}/${this.configService.get(
        `STATIC_${fileType}_DIRECTORY`,
      )}/${fileNameWithExtension}`,
    );

    copyFileSync(file, newFilePath);
    return fileNameWithExtension;
  }

  private async saveBase64Image(
    base64String: string,
    fileType: 'AVATAR' | 'BACKGROUND' | 'GAME',
  ) {
    const imageId = randomUUID();

    // Extract the image format from the base64 string
    const matches = base64String.match(/^data:image\/([A-Za-z]+);base64,/);
    if (!matches || matches.length < 2) {
      console.error('Invalid base64 image string:', base64String);
      return;
    }
    const imageFormat = matches[1].toLowerCase();

    // Remove the prefix from the base64 string
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

    // Create a buffer from the base64 data
    const buffer = Buffer.from(base64Data, 'base64');

    // Write the buffer to a file with the appropriate extension
    const fileName = `${imageId}.${imageFormat}`;

    await writeFile(
      normalize(
        `${this.configService.get(
          'STATIC_ROOT_DIRECTORY',
        )}/${this.configService.get(
          `STATIC_${fileType}_DIRECTORY`,
        )}/${fileName}`,
      ),
      buffer,
    );
  }

  private async optimizeImage(
    image: Express.Multer.File,
    options: IOptimizeImageOptions,
  ): Promise<Express.Multer.File> {
    const newImage = image;

    const resizedBuffer = await sharp(image.buffer)
      .resize({
        width: options.width,
        height: options.height,
        fit: 'inside', // Maintain aspect ratio
        withoutEnlargement: true, // Don't enlarge images smaller than 800px
      })
      .webp({
        effort: 5,
      })
      .toBuffer();

    newImage.buffer = resizedBuffer;
    newImage.mimetype = 'image/webp';

    return newImage;
  }
}

interface IOptimizeImageOptions {
  height: number;
  width: number;
}
