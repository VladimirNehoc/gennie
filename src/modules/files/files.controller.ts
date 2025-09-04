import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
// если используешь аутентификацию — добавь Guard/достань userId из req.user
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { FilesService } from "./files.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UploadDto } from "./dto/upload.dto";
import { IFile } from "./types/file.interface";
import { UploadFileResponseDto } from "./dto/upload-file-response.dto";
import { DeleteFileResponseDto } from "./dto/delete-file-response.dto";
import { FileDto } from "./dto/file.dto";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post("upload")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file", { storage: memoryStorage() }))
  @ApiBody({ type: UploadDto })
  @ApiResponse({
    status: 201,
    description: "Файл успешно загружен",
    type: UploadFileResponseDto,
  })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query("folder") folder?: string,
    @Query("public") publicQ?: string
  ): Promise<UploadFileResponseDto> {
    if (!file) throw new BadRequestException("No file");
    const saved = await this.filesService.uploadBuffer(
      {
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
      {
        folder,
        publicRead: publicQ === "true",
        // ownerId: req.user?.id, // если есть авторизация
      }
    );

    const signedUrl = saved.url
      ? null
      : await this.filesService.getSignedGetUrl(saved.key, 3600);
    return {
      id: saved.id,
      key: saved.key,
      url: saved.url ?? signedUrl, // вернём рабочую ссылку (публичную или временную)
      contentType: saved.contentType,
      size: saved.size,
      createdAt: saved.createdAt,
    };
  }

  @Get(":id")
  @ApiOperation({ summary: "Получить метаданные файла" })
  @ApiResponse({ status: 200, type: FileDto })
  @ApiResponse({ status: 404, description: "Файл не найден" })
  async getOne(
    @Param("id") fileId: string,
    @Query("signed") signed?: string
  ): Promise<FileDto> {
    const fileMeta = await this.filesService.getMeta(fileId);
    if (!fileMeta) {
      throw new NotFoundException("File not found");
    }

    const fileUrl =
      signed === "true" || !fileMeta.url
        ? await this.filesService.getSignedGetUrl(fileMeta.key, 3600)
        : fileMeta.url;

    return { ...fileMeta, url: fileUrl };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Удалить файл по ID" })
  @ApiResponse({
    status: 200,
    description: "Файл удалён",
    type: DeleteFileResponseDto,
  })
  @ApiResponse({ status: 404, description: "Файл не найден" })
  async remove(@Param("id") fileId: string): Promise<DeleteFileResponseDto> {
    return this.filesService.removeById(fileId);
  }
}
