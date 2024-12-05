import { Module } from '@nestjs/common';
import { TaskService } from './services/task.service';
import { TaskController } from './task.controller';
import { TaskRepository } from './repositories/task.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity]), HttpModule],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
  exports: [TaskService],
})
export class TaskModule {}
