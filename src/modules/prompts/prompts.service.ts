import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Prompt } from "./prompt.entity";

@Injectable()
export class PromptsService {
  constructor(
    @InjectRepository(Prompt)
    private repo: Repository<Prompt>
  ) {}

  findAll() {
    return this.repo.find({
      select: ["id", "title", "description", "previewUrl", "type", "isPremium"],
    });
  }

  async findOne(id: string) {
    const prompt = await this.repo.findOneBy({ id });
    if (!prompt) throw new NotFoundException(`Prompt ${id} not found`);
    return prompt;
  }

  async create(data: Partial<Prompt>) {
    const prompt = this.repo.create(data);
    return this.repo.save(prompt);
  }

  async update(id: string, data: Partial<Prompt>) {
    const prompt = await this.findOne(id);
    Object.assign(prompt, data);
    return this.repo.save(prompt);
  }

  async remove(id: string) {
    const prompt = await this.findOne(id);
    return this.repo.remove(prompt);
  }
}
