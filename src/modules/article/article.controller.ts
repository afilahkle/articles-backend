import { Controller, Post } from '@nestjs/common';

@Controller('api/articles')
export class ArticleController {
  @Post()
  async createArticle() {
    return "create article";
  }
}
