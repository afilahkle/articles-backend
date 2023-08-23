import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../user/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { CreateArticleDto } from './dtos/createArticle.dto';
import { ArticleService } from './article.service';
import { UserEntity } from '../user/entities/user.entity';

@Controller('api/articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService
  ){
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@User() currentUser: UserEntity, @Body('article') createArticleDto:CreateArticleDto): Promise<any> {
    return await this.articleService.createArticle(currentUser, createArticleDto)
  }
}
