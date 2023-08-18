import { Controller, Post } from '@nestjs/common';

@Controller('api')
export class UserController {
  @Post("users")
  async createUser (): Promise<any> {
    return 'createUser';
  }
}
