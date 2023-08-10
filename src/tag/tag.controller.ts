import { Get, Controller } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('api')
export class TagController {
  constructor(
    private readonly tagService: TagService
  ){

  }
  @Get('tags')
  findAll() {
    return this.tagService.findAll();
  }
}
