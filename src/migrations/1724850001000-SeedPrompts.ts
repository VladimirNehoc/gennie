import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedPrompts1724850001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      INSERT INTO "prompts" (id, title, description, "previewUrl", type, config, "isPremium", "createdAt")
      VALUES
        (uuid_generate_v4(), 'Retouch face', 'Убирает дефекты кожи, делает лёгкую ретушь', null, 'image-to-image', '{}'::jsonb, false, NOW()),
        (uuid_generate_v4(), 'Cartoon style', 'Преобразует фото в мультяшный стиль', null, 'image-to-image', '{}'::jsonb, false, NOW()),
        (uuid_generate_v4(), 'Old photo', 'Эффект старой фотографии', null, 'image-to-image', '{}'::jsonb, false, NOW()),
        (uuid_generate_v4(), 'Cyberpunk look', 'Добавляет неон, тёмный фон, стиль киберпанк', null, 'image-to-image', '{}'::jsonb, true, NOW()),
        (uuid_generate_v4(), 'Anime portrait', 'Аниме-стиль портрета', null, 'image-to-image', '{}'::jsonb, false, NOW()),
        (uuid_generate_v4(), 'Fantasy character', 'Создание образа фэнтези-персонажа', null, 'image-to-image', '{}'::jsonb, true, NOW()),
        (uuid_generate_v4(), 'Professional headshot', 'Делает деловую фотографию для профиля', null, 'image-to-image', '{}'::jsonb, false, NOW()),
        (uuid_generate_v4(), 'Pixar style', 'Преобразует лицо в стиле Pixar', null, 'image-to-image', '{}'::jsonb, true, NOW()),
        (uuid_generate_v4(), 'Sketch drawing', 'Рисунок карандашом', null, 'image-to-image', '{}'::jsonb, false, NOW()),
        (uuid_generate_v4(), 'Oil painting', 'Картина маслом', null, 'image-to-image', '{}'::jsonb, false, NOW())
      ON CONFLICT DO NOTHING
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "prompts"
      WHERE title IN (
        'Retouch face',
        'Cartoon style',
        'Old photo',
        'Cyberpunk look',
        'Anime portrait',
        'Fantasy character',
        'Professional headshot',
        'Pixar style',
        'Sketch drawing',
        'Oil painting'
      )
    `);
  }
}
