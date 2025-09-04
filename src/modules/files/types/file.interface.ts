import { ISchema } from "src/common/base/base.interface";

export interface IFileBase {
  bucket: string;
  key: string;
  url: string | null;
  contentType: string | null;
  size: number | null;
  ownerId: string | null;
  meta: Record<string, any> | null;
}

export interface IFile extends ISchema, IFileBase {}
