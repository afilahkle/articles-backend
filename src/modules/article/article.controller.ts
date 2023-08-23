import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../user/guards/auth.guard';
import { ArticleService } from './article.service';

@Controller('api/articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService
  ){
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(): Promise<any> {
    return await this.articleService.createArticle()
  }
}
