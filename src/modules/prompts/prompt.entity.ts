import { PromptType } from "@lib/enums/prompt-type.enum";
import { IPrompt } from "@lib/interfaces/prompt";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
} from "typeorm";
import { FileEntity } from "../files/files.entity";

@Entity("prompts")
export class Prompt implements IPrompt {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "uuid", nullable: true })
  beforeImageId: string | null;

  @ManyToOne(() => FileEntity, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "beforeImageId" })
  beforeImage?: FileEntity | null;

  @Column({ type: "uuid", nullable: true })
  afterImageId: string | null;

  @ManyToOne(() => FileEntity, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "afterImageId" })
  afterImage?: FileEntity | null;

  @Column({
    type: "enum",
    enum: PromptType,
    default: PromptType.ImageToImage,
  })
  type: PromptType;

  @Column({ type: "text", default: "" })
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
