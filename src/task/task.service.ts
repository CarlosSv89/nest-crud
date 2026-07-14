import { Injectable } from '@nestjs/common';
import { Tasks } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}
  tasks: Tasks[];

  getAllTasks(): Promise<Tasks[]> {
    return this.prisma.tasks.findMany();
  }

  getTaskById(id: number): Promise<Tasks> {
    return this.prisma.tasks.findUnique({
      where: {
        id: id,
      },
    });
  }

  getTasksByUserId(userId: number): Promise<Tasks[]> {
    return this.prisma.tasks.findMany({
      where: {
        userId: userId,
      },
    });
  }

  createTask(data: Tasks): Promise<Tasks> {
    return this.prisma.tasks.create({
      data,
    });
  }

  deleteTask(id: number): Promise<Tasks> {
    return this.prisma.tasks.delete({
      where: {
        id,
      },
    });
  }

  updateTask(id: number, data: Partial<Tasks>): Promise<Tasks> {
    return this.prisma.tasks.update({
      where: {
        id,
      },
      data,
    });
  }
}
