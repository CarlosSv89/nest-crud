import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  HttpException,
  ParseIntPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Tasks } from '@prisma/client';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  // Get all tasks
  @Get()
  async getAllTasks() {
    return this.taskService.getAllTasks();
  }

  // Get tasks by user id
  @Get('user/:id')
  async getTasksByUserId(@Param('id', ParseIntPipe) id: number) {
    try {
      if (!id) {
        throw new HttpException('User id is required', 400);
      } else {
        return await this.taskService.getTasksByUserId(id);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Get task by id
  @Get(':id')
  async getTaskById(@Param('id', ParseIntPipe) id: number) {
    return await this.taskService.getTaskById(id);
  }

  // Create task
  @Post()
  async createTask(@Body() data: Tasks) {
    try {
      if (!data.title || !data.content || !data.userId || !data.status) {
        throw new HttpException('All fields are required', 400);
      } else {
        data.userId = Number(data.userId);
        return await this.taskService.createTask(data);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Delete task
  @Delete(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number) {
    try {
      const task = await this.taskService.getTaskById(id);
      if (!task) {
        throw new HttpException('Task not found', 404);
      }
      return await this.taskService.deleteTask(id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Complete task
  @Put('complete/:id')
  async completeTask(@Param('id', ParseIntPipe) id: number) {
    try {
      const task = await this.taskService.getTaskById(id);
      if (!task) {
        throw new HttpException('Task not found', 404);
      }
      task.status = 'completed';
      return await this.taskService.updateTask(id, task);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Update task
  @Put(':id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Tasks>,
  ) {
    try {
      const task = await this.taskService.getTaskById(id);
      if (!task) {
        throw new HttpException('Task not found', 404);
      }
      if (data.userId) {
        data.userId = Number(data.userId);
      }
      return await this.taskService.updateTask(id, data as Tasks);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
