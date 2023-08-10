import { Get, Controller } from '@nestjs/common';

@Controller('api')
export class TagController {
  @Get('tags')
  findAll() {
    return ['javascript', 'nodejs'];
  }
}
