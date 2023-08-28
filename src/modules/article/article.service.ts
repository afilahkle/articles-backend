import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dtos/createArticle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { DeleteResult, EntityManager, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import slugify from 'slugify';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly entityManager: EntityManager
  ){
  }

  async findAll(currentUserId: number, query: any): Promise<ArticlesResponseInterface> {
    const queryBuilder = this.entityManager.getRepository(ArticleEntity).createQueryBuilder('articles').leftJoinAndSelect('articles.author', 'author');
    const articlesCount = await queryBuilder.getCount();

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    if(query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`
      })
    }

    if(query.author) {
      const author = await this.userRepository.findOne({
        where: {
          username: query.author
        }
      })

      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id
      })
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    
    const articles = await queryBuilder.getMany();

    return {articles, articlesCount}
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

  async findBySlug(slug: string): Promise<ArticleEntity> {
   return  await this.articleRepository.findOne({
      where: {
        slug
      }
    })

  }

  async deleteSingleArticle( slug: string, currentUserId: number): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND)
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('Your are not the author', HttpStatus.FORBIDDEN)
    }

    return await this.articleRepository.delete({slug})
  }

  async updateSingleArticle(slug: string, currentUserId: number, updateArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND)
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('Your are not the author', HttpStatus.FORBIDDEN)
    }

    Object.assign(article, updateArticleDto);

   return await this.articleRepository.save(article);
  }

  getSlug(title: string): string {
    const randomString = (Math.random() * Math.pow(36, 6) | 0).toString(36)
    return slugify(title, {lower: true}) + '-' + randomString
  }

  async addArticleToFavorites(slug: string, userId: number): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne({
      relations: ['favorites'],
      where: {
        id: userId 
      }
    })
    
    const isNotFavorited = user.favorites.findIndex(articlesInFavorites => articlesInFavorites.id === article.id) === -1;

    if (isNotFavorited) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }
  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return {
      article
    }
  }
}
