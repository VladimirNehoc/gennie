import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { S3Client } from "@aws-sdk/client-s3";

export const S3_CLIENT = Symbol("S3_CLIENT");

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: S3_CLIENT,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const endpoint =
          cfg.get<string>("YANDEX_S3_ENDPOINT") ??
          "https://storage.yandexcloud.net";
        const region = cfg.get<string>("YANDEX_S3_REGION") ?? "ru-central1";
        const accessKeyId = cfg.get<string>("YANDEX_S3_KEY")!;
        const secretAccessKey = cfg.get<string>("YANDEX_S3_SECRET")!;
        return new S3Client({
          region,
          endpoint,
          credentials: { accessKeyId, secretAccessKey },
          forcePathStyle: false, // если имя бакета с точками, можно true
        });
      },
    },
  ],
  exports: [S3_CLIENT],
})
export class S3Module {}
