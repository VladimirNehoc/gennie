import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("prompts")
export class Prompt {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  previewUrl: string;

  @Column({
    type: "enum",
    enum: ["image-to-image", "text-to-image", "text-to-text"],
    default: "image-to-image",
  })
  type: "image-to-image" | "text-to-image" | "text-to-text";

  @Column({ type: "jsonb", default: {} })
  config: Record<string, any>;

  @Column({ default: false })
  isPremium: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
