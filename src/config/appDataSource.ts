import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppDataSource implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
        type: 'postgres',
        host: this.configService.get('DB_HOST'),
        port: this.configService.get('DB_PORT'),
        username: this.configService.get('DB_USERNAME'),
        password: this.configService.get('DB_PASSWORD'),
        database: this.configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity.{ts,js}'],
        autoLoadEntities: true, // don't add this in production.
        synchronize: true, // don't add this in production. 
    };
  }
}