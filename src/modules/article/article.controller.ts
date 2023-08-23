import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../user/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { CreateArticleDto } from './dtos/createArticle.dto';
import { ArticleService } from './article.service';
import { UserEntity } from '../user/entities/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';

@Controller('api/articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService
  ){
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@User() currentUser: UserEntity, @Body('article') createArticleDto:CreateArticleDto): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(currentUser, createArticleDto)
    return this.articleService.buildArticleResponse(article)
  }

  @Get(':slug')
  async getSingleArticle(@Param('slug') slug: string): Promise<ArticleResponseInterface> {
    const article = await this.articleService.findBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  } 

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteSingleArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string) {
     return await this.articleService.deleteSingleArticle(slug, currentUserId) 
    } 
}
