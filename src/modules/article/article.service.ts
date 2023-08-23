import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dtos/createArticle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>
  ){
  }

  async createArticle (currentUser: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto)

    if (!article.tagList) {
      article.tagList = []
    }

    article.slug = this.getSlug(createArticleDto.title);
    article.author = currentUser;
    return await this.articleRepository.save(article);
  }

  getSlug(title: string): string {
    const randomString = (Math.random() * Math.pow(36, 6) | 0).toString(36)
    return slugify(title, {lower: true}) + '-' + randomString
  }
}
