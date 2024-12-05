import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './services/task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserPayloadDto } from '../auth/dto/user-payload.dto';

@Controller('task')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  createTask(
    @CurrentUser() user: UserPayloadDto,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    if (!createTaskDto.userId) {
      createTaskDto.userId = user.id;
    }
    return this.taskService.createTask(createTaskDto);
  }

  @Get()
  findAllTasks() {
    return this.taskService.findAllTasks();
  }

  @Get('user')
  findAllTasksByUser(@CurrentUser() user: UserPayloadDto) {
    return this.taskService.findAllTasksByUser(user);
  }

  @Patch(':id')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: UserPayloadDto,
  ) {
    if (!updateTaskDto.userId) {
      updateTaskDto.userId = user.id;
    }
    return this.taskService.updateTask(+id, updateTaskDto);
  }

  @Patch(':id/revert')
  revertStatusTask(@Param('id') id: string) {
    return this.taskService.revertStatusTask(+id);
  }

  @Delete(':id')
  removeTask(@Param('id') id: string) {
    return this.taskService.removeTask(+id);
  }
}
