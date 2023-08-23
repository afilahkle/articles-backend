import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticleService {
  async createArticle () {
    return "create article from serivce";
  }
}
