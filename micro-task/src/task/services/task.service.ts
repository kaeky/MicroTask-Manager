import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskRepository } from '../repositories/task.repository';
import { UserPayloadDto } from '../../auth/dto/user-payload.dto';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}
  createTask(createTaskDto: CreateTaskDto) {
    return this.taskRepository.createTask(createTaskDto);
  }

  findAllTasks() {
    return this.taskRepository.find();
  }

  findAllTasksByUser(user: UserPayloadDto) {
    return this.taskRepository.findAllTasksByUser(user.id);
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    const { status } = await this.taskRepository.getCurrentStatus(id);
    return this.taskRepository.updateTask(id, updateTaskDto, status);
  }

  revertStatusTask(id: number) {
    return this.taskRepository.revertStatusTask(id);
  }

  async removeTask(id: number) {
    await this.taskRepository.removeTask(id);
    return { message: 'OK' };
  }
}
