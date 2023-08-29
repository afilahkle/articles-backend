import { Controller, Get, Param } from '@nestjs/common';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { User } from '../user/decorators/user.decorator';
import { ProfileService } from './profile.service';
import { ProfileType } from './types/profile.type';

@Controller('api/profiles')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService
  ) {
  }

  @Get(':username')
  async getProfile(
    @User('id') currentUserId: number,
    @Param('username') profileUsername: string
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(currentUserId, profileUsername);
    return this.profileService.buildProfileResponse(profile);
  } 
    
}
