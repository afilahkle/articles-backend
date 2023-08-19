import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dtos/loginUser.dto';

@Controller('api')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {

  }
  @Post("users")
  @UsePipes(new ValidationPipe())
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async loginUser(@Body('user') loginUserDto: LoginUserDto) : Promise<UserResponseInterface> {
   const user = await this.userService.loginUser(loginUserDto);
   return this.userService.buildUserResponse(user); 
  }
}
