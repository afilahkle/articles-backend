import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { ProfileType } from './types/profile.type';
import { Http2ServerRequest } from 'http2';
import { FollowEntity } from './entities/follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>
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

  async followProfile(currentUserId: number, profileUsername: string): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: {
        username: profileUsername
      }
    });

    if (!user) {
      throw new HttpException('Profile does not exit', HttpStatus.NOT_FOUND)
    }

    if (currentUserId === user.id) {
      throw new HttpException('Follower and Following can\'t be equal', HttpStatus.BAD_REQUEST);
    }

    const follow = await this.followRepository.findOne({
      where: {
        followerId: currentUserId,
        followingId: user.id
      }
    })

    if (!follow) {
      const followToCreate = new FollowEntity();
      followToCreate.followerId = currentUserId;
      followToCreate.followingId = user.id;
      await this.followRepository.save(followToCreate);
    }

    return {
      ...user,
      following: true
    }
  }

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    delete profile.email;
    delete profile.password;

    return {profile}
  }
}
