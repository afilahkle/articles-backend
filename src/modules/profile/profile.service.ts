import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { ProfileType } from './types/profile.type';
import { Http2ServerRequest } from 'http2';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {
  }

  async getProfile(currentUserId: number, profileUsername: string): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: {
        username: profileUsername
      }
    });

    if (!user) {
      throw new HttpException('Profile does not exit', HttpStatus.NOT_FOUND)
    }

    return {
      ...user,
      following: false
    }
  }

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    delete profile.email;
    delete profile.password;

    return {profile}
  }
}
