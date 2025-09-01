import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { ConfigService } from "@nestjs/config";
import { FileEntity } from "./files.entity";
import { S3_CLIENT } from "./s3.module";

type UploadOpts = {
  folder?: string;
  publicRead?: boolean;
  ownerId?: string | null;
  meta?: Record<string, any>;
};

@Injectable()
export class FilesService {
  private readonly bucket: string;
  private readonly publicBase?: string;
  private readonly defaultPublic: boolean;

  constructor(
    @Inject(S3_CLIENT) private readonly s3: S3Client,
    private readonly cfg: ConfigService,
    @InjectRepository(FileEntity) private readonly repo: Repository<FileEntity>
  ) {
    this.bucket = this.cfg.get<string>("YANDEX_S3_BUCKET")!;
    this.publicBase =
      this.cfg.get<string>("YANDEX_S3_PUBLIC_BASE") || undefined;
    this.defaultPublic =
      (this.cfg.get<string>("FILES_DEFAULT_PUBLIC") ?? "false") === "true";
  }

  private getPublicUrl(key: string) {
    return this.publicBase
      ? `${this.publicBase.replace(/\/$/, "")}/${key}`
      : null;
  }

  private buildKey(originalName: string, folder?: string) {
    const ext = (originalName.split(".").pop() || "bin").toLowerCase();
    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(now.getUTCDate()).padStart(2, "0");
    const base = folder?.replace(/^\/|\/$/g, "") || "uploads";
    return `${base}/${yyyy}/${mm}/${dd}/${randomUUID()}.${ext}`;
  }

  async uploadBuffer(
    file: {
      buffer: Buffer;
      originalname: string;
      mimetype?: string;
      size?: number;
    },
    opts: UploadOpts = {}
  ): Promise<FileEntity> {
    const key = this.buildKey(file.originalname, opts.folder);
    const publicRead = opts.publicRead ?? this.defaultPublic;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: publicRead ? "public-read" : undefined,
        Metadata: opts.meta as any,
      })
    );

    const entity = this.repo.create({
      bucket: this.bucket,
      key,
      url: publicRead ? this.getPublicUrl(key) : null,
      contentType: file.mimetype ?? null,
      size: file.size ?? null,
      ownerId: opts.ownerId ?? null,
      meta: opts.meta ?? null,
    });
    return this.repo.save(entity);
  }

  async getSignedGetUrl(key: string, expiresSec = 3600) {
    const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.s3, cmd, { expiresIn: expiresSec });
  }

  async removeById(id: string) {
    const f = await this.repo.findOne({ where: { id } });
    if (!f) throw new NotFoundException("File not found");
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: f.bucket, Key: f.key })
    );
    await this.repo.delete({ id: f.id });
    return { ok: true, id };
  }

  async getMeta(id: string) {
    const f = await this.repo.findOne({ where: { id } });
    if (!f) throw new NotFoundException("File not found");
    return f;
  }
}
