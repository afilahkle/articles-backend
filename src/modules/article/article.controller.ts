import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../user/guards/auth.guard';

@Controller('api/articles')
export class ArticleController {
  @Post()
  @UseGuards(AuthGuard)
  async create() {
    return "create article";
  }
}
