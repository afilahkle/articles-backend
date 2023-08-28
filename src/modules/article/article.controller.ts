import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '../user/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { CreateArticleDto } from './dtos/createArticle.dto';
import { ArticleService } from './article.service';
import { UserEntity } from '../user/entities/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';

@Controller('api/articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService
  ){
  }

  @Get()
  async findAll(@User('id') currentUserId: number, @Query() query: any): Promise<ArticlesResponseInterface> {
    return await this.articleService.findAll(currentUserId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
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

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateSingleArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: CreateArticleDto
    ): Promise<ArticleResponseInterface> {
      const article = await this.articleService.updateSingleArticle(slug, currentUserId, updateArticleDto);
      return this.articleService.buildArticleResponse(article);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(@User('id') currentUserId: number, @Param('slug') slug: string): Promise<ArticleResponseInterface> {
    const article = await this.articleService.addArticleToFavorites(slug, currentUserId);
    return this.articleService.buildArticleResponse(article);
  }

}
