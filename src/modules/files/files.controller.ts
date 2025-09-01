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
} from "@nestjs/common";
// если используешь аутентификацию — добавь Guard/достань userId из req.user
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { FilesService } from "./files.service";

@Controller("files")
export class FilesController {
  constructor(private readonly files: FilesService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file", { storage: memoryStorage() }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query("folder") folder?: string,
    @Query("public") publicQ?: string
  ) {
    if (!file) throw new BadRequestException("No file");
    const saved = await this.files.uploadBuffer(
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
      : await this.files.getSignedGetUrl(saved.key, 3600);
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
  async getOne(@Param("id") id: string, @Query("signed") signed?: string) {
    const meta = await this.files.getMeta(id);
    const url =
      signed === "true" || !meta.url
        ? await this.files.getSignedGetUrl(meta.key, 3600)
        : meta.url;

    return { ...meta, url };
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.files.removeById(id);
  }
}
