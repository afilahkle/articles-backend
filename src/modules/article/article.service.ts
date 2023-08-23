import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dtos/createArticle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>
  ){
  }

  async createArticle (currentUser: UserEntity, createArticleDto: CreateArticleDto): Promise<any> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto)

    if (!article.tagList) {
      article.tagList = []
    }

    article.slug = 'foo'; // just for testing

    article.author = currentUser;
    
    console.log(article);
    return await this.articleRepository.save(article);
  
  }
}
