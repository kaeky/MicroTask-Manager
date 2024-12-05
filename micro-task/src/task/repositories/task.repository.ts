import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity, TaskStatus } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  public find = this.taskRepository.find.bind(this.taskRepository);

  public async createTask(taskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.taskRepository.save(taskDto);
  }

  public async findAllTasksByUser(userId: number): Promise<TaskEntity[]> {
    return this.taskRepository.find({ where: { userId } });
  }

  public async getCurrentStatus(id): Promise<TaskEntity> {
    return await this.taskRepository.findOne({
      select: ['status', 'prevStatus'],
      where: { id },
    });
  }

  public async revertStatusTask(id: number): Promise<TaskEntity> {
    const { status, prevStatus } = await this.getCurrentStatus(id);
    if (!prevStatus) {
      throw new BadRequestException('No previous status');
    }
    return this.taskRepository.save({
      id,
      status: prevStatus,
      prevStatus: status,
    });
  }

  public async updateTask(
    id: number,
    updateTaskDto: UpdateTaskDto,
    currentStatus?: TaskStatus,
  ): Promise<TaskEntity> {
    if (currentStatus !== updateTaskDto.status) {
      updateTaskDto.prevStatus = currentStatus;
    }
    return this.taskRepository.save({ id, ...updateTaskDto });
  }

  public async removeTask(id: number): Promise<void> {
    await this.taskRepository.softDelete(id);
  }
}
