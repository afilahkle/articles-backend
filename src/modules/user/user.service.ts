import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserResponseInterface } from './types/userResponse.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private configService: ConfigService
  ) {

  }
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return this.userRepository.save(newUser);
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email
      },
      this.configService.get('JWT_SECRET')
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
   return {
    user: {
      ...user,
      token: this.generateJwt(user)
    }
   } 
  }
}
