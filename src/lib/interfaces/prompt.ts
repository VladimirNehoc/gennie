import type { PromptType } from "@lib/enums/prompt-type.enum";

export interface IPrompt {
  id: string;
  title: string;
  description?: string | null;
  beforeUrl?: string | null;
  afterUrl?: string | null;
  type: PromptType;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}
