import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '@prisma/client';

const mockUser: User = {
  id: 1,
  email: 'john@test.com',
  name: 'john',
  password: 'secret',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UserController', () => {
  let controller: UserController;
  let service: {
    getAllUsers: jest.Mock;
    getUserById: jest.Mock;
    createUser: jest.Mock;
    updateUser: jest.Mock;
    deleteUser: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: service }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('returns all users', async () => {
      service.getAllUsers.mockResolvedValue([mockUser]);
      await expect(controller.getAllUsers()).resolves.toEqual([mockUser]);
    });
  });

  describe('getUserById', () => {
    it('returns a user by id', async () => {
      service.getUserById.mockResolvedValue(mockUser);
      await expect(controller.getUserById(1)).resolves.toEqual(mockUser);
      expect(service.getUserById).toHaveBeenCalledWith(1);
    });
  });

  describe('createUser', () => {
    it('creates a user with valid data', async () => {
      service.createUser.mockResolvedValue(mockUser);
      await expect(controller.createUser(mockUser)).resolves.toEqual(mockUser);
    });

    it('throws when required fields are missing', async () => {
      await expect(
        controller.createUser({ ...mockUser, email: '' }),
      ).rejects.toBeInstanceOf(HttpException);
      expect(service.createUser).not.toHaveBeenCalled();
    });

    it('throws conflict when the name already exists', async () => {
      service.createUser.mockResolvedValue(null);
      await expect(controller.createUser(mockUser)).rejects.toBeInstanceOf(
        HttpException,
      );
    });
  });

  describe('updateUser', () => {
    it('updates an existing user', async () => {
      const updated = { ...mockUser, name: 'johnny' };
      service.getUserById.mockResolvedValue(mockUser);
      service.updateUser.mockResolvedValue(updated);
      await expect(
        controller.updateUser(1, { name: 'johnny' }),
      ).resolves.toEqual(updated);
      expect(service.updateUser).toHaveBeenCalledWith(1, { name: 'johnny' });
    });

    it('throws not found when the user does not exist', async () => {
      service.getUserById.mockResolvedValue(null);
      await expect(
        controller.updateUser(99, { name: 'johnny' }),
      ).rejects.toBeInstanceOf(HttpException);
      expect(service.updateUser).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('deletes an existing user', async () => {
      service.getUserById.mockResolvedValue(mockUser);
      service.deleteUser.mockResolvedValue(mockUser);
      await expect(controller.deleteUser(1)).resolves.toEqual(mockUser);
      expect(service.deleteUser).toHaveBeenCalledWith(1);
    });

    it('throws not found when the user does not exist', async () => {
      service.getUserById.mockResolvedValue(null);
      await expect(controller.deleteUser(99)).rejects.toBeInstanceOf(
        HttpException,
      );
      expect(service.deleteUser).not.toHaveBeenCalled();
    });
  });
});
