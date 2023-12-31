import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dtos/loginUser.dto';
import { compare } from 'bcrypt';
import { UpdateUserDto } from './dtos/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private configService: ConfigService
  ) {

  }
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {}
    }

    const userByEmail = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      }
    });

    const userByUsername = await this.userRepository.findOne({
      where: {
        username: createUserDto.username,
      }
    });
    
    if (userByEmail) {
      errorResponse.errors['email'] = 'has already been taken';
    }

    if (userByUsername) {
      errorResponse.errors['username'] = 'has already been taken';
    }

    if (userByEmail || userByUsername) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY)
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return this.userRepository.save(newUser);
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id
      }
    });

    delete user.password;
    return user;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {
        'email or password': 'is invalid'
      }
    }

    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      }
    });

    if(!user) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY)
    }
      
    if(!await compare(loginUserDto.password, (await user).password)) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY)
    }

    delete user.password;
    return user;
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findById(userId);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
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
