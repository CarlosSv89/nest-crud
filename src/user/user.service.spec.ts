import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

const mockUser: User = {
  id: 1,
  email: 'john@test.com',
  name: 'john',
  password: 'secret',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UserService', () => {
  let service: UserService;
  let prisma: {
    user: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('returns all users', async () => {
      prisma.user.findMany.mockResolvedValue([mockUser]);
      await expect(service.getAllUsers()).resolves.toEqual([mockUser]);
      expect(prisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('returns a single user by id', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      await expect(service.getUserById(1)).resolves.toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('getUserByName', () => {
    it('returns true when a user with the name exists', async () => {
      prisma.user.findFirst.mockResolvedValue(mockUser);
      await expect(service.getUserByName('john')).resolves.toBe(true);
    });

    it('returns false when no user with the name exists', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(service.getUserByName('ghost')).resolves.toBe(false);
    });
  });

  describe('createUser', () => {
    it('creates a user when the name is not taken', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser);
      await expect(service.createUser(mockUser)).resolves.toEqual(mockUser);
      expect(prisma.user.create).toHaveBeenCalledWith({ data: mockUser });
    });

    it('returns null when the name is already taken', async () => {
      prisma.user.findFirst.mockResolvedValue(mockUser);
      await expect(service.createUser(mockUser)).resolves.toBeNull();
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('updates a user and refreshes updatedAt', async () => {
      const updated = { ...mockUser, name: 'johnny' };
      prisma.user.update.mockResolvedValue(updated);
      await expect(
        service.updateUser(1, { name: 'johnny' }),
      ).resolves.toEqual(updated);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          name: 'johnny',
          updatedAt: expect.any(Date),
        }),
      });
    });
  });

  describe('deleteUser', () => {
    it('deletes a user by id', async () => {
      prisma.user.delete.mockResolvedValue(mockUser);
      await expect(service.deleteUser(1)).resolves.toEqual(mockUser);
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
