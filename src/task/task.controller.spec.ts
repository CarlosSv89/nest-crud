import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
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

describe('TaskController', () => {
  let controller: TaskController;
  let service: {
    getAllTasks: jest.Mock;
    getTaskById: jest.Mock;
    getTasksByUserId: jest.Mock;
    createTask: jest.Mock;
    updateTask: jest.Mock;
    deleteTask: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      getAllTasks: jest.fn(),
      getTaskById: jest.fn(),
      getTasksByUserId: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [{ provide: TaskService, useValue: service }],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllTasks', () => {
    it('returns all tasks', async () => {
      service.getAllTasks.mockResolvedValue([mockTask]);
      await expect(controller.getAllTasks()).resolves.toEqual([mockTask]);
    });
  });

  describe('getTaskById', () => {
    it('returns a task by id', async () => {
      service.getTaskById.mockResolvedValue(mockTask);
      await expect(controller.getTaskById(1)).resolves.toEqual(mockTask);
      expect(service.getTaskById).toHaveBeenCalledWith(1);
    });
  });

  describe('getTasksByUserId', () => {
    it('returns tasks for a user', async () => {
      service.getTasksByUserId.mockResolvedValue([mockTask]);
      await expect(controller.getTasksByUserId(1)).resolves.toEqual([
        mockTask,
      ]);
    });
  });

  describe('createTask', () => {
    it('creates a task with valid data', async () => {
      service.createTask.mockResolvedValue(mockTask);
      await expect(controller.createTask({ ...mockTask })).resolves.toEqual(
        mockTask,
      );
    });

    it('throws when required fields are missing', async () => {
      await expect(
        controller.createTask({ ...mockTask, title: '' }),
      ).rejects.toBeInstanceOf(HttpException);
      expect(service.createTask).not.toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    it('updates an existing task', async () => {
      const updated = { ...mockTask, title: 'Updated' };
      service.getTaskById.mockResolvedValue(mockTask);
      service.updateTask.mockResolvedValue(updated);
      await expect(
        controller.updateTask(1, { title: 'Updated' }),
      ).resolves.toEqual(updated);
      expect(service.updateTask).toHaveBeenCalledWith(1, { title: 'Updated' });
    });

    it('throws not found when the task does not exist', async () => {
      service.getTaskById.mockResolvedValue(null);
      await expect(
        controller.updateTask(99, { title: 'Updated' }),
      ).rejects.toBeInstanceOf(HttpException);
      expect(service.updateTask).not.toHaveBeenCalled();
    });
  });

  describe('completeTask', () => {
    it('marks an existing task as completed', async () => {
      service.getTaskById.mockResolvedValue({ ...mockTask });
      service.updateTask.mockImplementation((_id, data) => data);
      const result = await controller.completeTask(1);
      expect(result.status).toBe('completed');
    });

    it('throws not found when the task does not exist', async () => {
      service.getTaskById.mockResolvedValue(null);
      await expect(controller.completeTask(99)).rejects.toBeInstanceOf(
        HttpException,
      );
      expect(service.updateTask).not.toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('deletes an existing task', async () => {
      service.getTaskById.mockResolvedValue(mockTask);
      service.deleteTask.mockResolvedValue(mockTask);
      await expect(controller.deleteTask(1)).resolves.toEqual(mockTask);
      expect(service.deleteTask).toHaveBeenCalledWith(1);
    });

    it('throws not found when the task does not exist', async () => {
      service.getTaskById.mockResolvedValue(null);
      await expect(controller.deleteTask(99)).rejects.toBeInstanceOf(
        HttpException,
      );
      expect(service.deleteTask).not.toHaveBeenCalled();
    });
  });
});
