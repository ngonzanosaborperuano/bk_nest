import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from './common.service';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigModule],
      useFactory: (configService: any) => typeOrmConfig(configService),
      imports: [ConfigModule],
    }),
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
