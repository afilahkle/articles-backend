import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';

@Injectable()
export class UserService {
  async createUser(createUserDto: CreateUserDto) {
    return createUserDto;
  }
}
