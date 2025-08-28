import type { PromptType } from "@lib/enums/prompt-type.enum";

export interface PromptConfig {
  // любые произвольные поля конфига
  [key: string]: unknown;
}

export interface IPrompt {
  id: string;
  title: string;
  description?: string | null;
  previewUrl?: string | null;
  type: PromptType;
  config: PromptConfig;
  isPremium: boolean;
  createdAt: Date;
}
