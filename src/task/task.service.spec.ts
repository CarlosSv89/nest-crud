import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tasks } from '@prisma/client';

const mockTask: Tasks = {
  id: 1,
  title: 'Test task',
  content: 'Test content',
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 1,
};

describe('TaskService', () => {
  let service: TaskService;
  let prisma: {
    tasks: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      tasks: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllTasks', () => {
    it('returns all tasks', async () => {
      prisma.tasks.findMany.mockResolvedValue([mockTask]);
      await expect(service.getAllTasks()).resolves.toEqual([mockTask]);
    });
  });

  describe('getTaskById', () => {
    it('returns a task by id', async () => {
      prisma.tasks.findUnique.mockResolvedValue(mockTask);
      await expect(service.getTaskById(1)).resolves.toEqual(mockTask);
      expect(prisma.tasks.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('getTasksByUserId', () => {
    it('returns tasks for a user', async () => {
      prisma.tasks.findMany.mockResolvedValue([mockTask]);
      await expect(service.getTasksByUserId(1)).resolves.toEqual([mockTask]);
      expect(prisma.tasks.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
    });
  });

  describe('createTask', () => {
    it('creates a task', async () => {
      prisma.tasks.create.mockResolvedValue(mockTask);
      await expect(service.createTask(mockTask)).resolves.toEqual(mockTask);
      expect(prisma.tasks.create).toHaveBeenCalledWith({ data: mockTask });
    });
  });

  describe('updateTask', () => {
    it('updates a task', async () => {
      const updated = { ...mockTask, status: 'completed' };
      prisma.tasks.update.mockResolvedValue(updated);
      await expect(
        service.updateTask(1, { status: 'completed' }),
      ).resolves.toEqual(updated);
      expect(prisma.tasks.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'completed' },
      });
    });
  });

  describe('deleteTask', () => {
    it('deletes a task by id', async () => {
      prisma.tasks.delete.mockResolvedValue(mockTask);
      await expect(service.deleteTask(1)).resolves.toEqual(mockTask);
      expect(prisma.tasks.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
