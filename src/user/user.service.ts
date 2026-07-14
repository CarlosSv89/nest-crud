import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  getAllUsers(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  getUserById(id: number): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getUserByName(name: string): Promise<boolean> {
    console.log('name filtered: ', name);
    const user = await this.prismaService.user.findFirst({
      where: {
        name: name,
      },
    });
    console.log('User: ', user);

    return user ? true : false;
  }

  async createUser(data: User): Promise<User> {
    const userAlreadyExists = await this.getUserByName(data.name);
    console.log('userAlreadyExists: ', userAlreadyExists);
    if (!userAlreadyExists) {
      return this.prismaService.user.create({
        data,
      });
    } else {
      return null;
    }
  }

  deleteUser(id: number): Promise<User> {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  updateUser(id: number, data: Partial<User>): Promise<User> {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }
}
