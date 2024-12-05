import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { CacheModule } from '@nestjs/cache-manager';
import { typeOrmConfig } from './config/database.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    EventEmitterModule.forRoot(),
    TaskModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
