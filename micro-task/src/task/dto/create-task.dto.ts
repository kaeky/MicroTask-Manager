import { TaskStatus } from '../entities/task.entity';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  dueDate: Date;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  teamId?: number;
}
