import { Get, Controller } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('api')
export class TagController {
  constructor(
    private readonly tagService: TagService
  ){

  }
  @Get('tags')
  async findAll(): Promise<{ tags: string[] }>{
    const tags = await this.tagService.findAll();
    return {
      tags: tags.map(tag => tag.name)
    }
  }
}
