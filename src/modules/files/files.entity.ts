import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("files")
export class FileEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 255 })
  bucket!: string;

  @Index()
  @Column({ length: 2048 })
  key!: string; // путь внутри бакета

  @Column({ type: "text", nullable: true })
  url!: string | null;

  @Column({ type: "text", nullable: true })
  contentType!: string | null;

  @Column({ type: "int", nullable: true })
  size!: number | null;

  @Index()
  @Column({ type: "uuid", nullable: true })
  ownerId!: string | null; // если нужен владелец

  @Column({ type: "jsonb", nullable: true })
  meta!: Record<string, any> | null;

  @CreateDateColumn()
  createdAt!: Date;
}
