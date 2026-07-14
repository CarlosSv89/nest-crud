import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // Get all users
  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  // Get user by id
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserById(id);
  }

  // Create user
  @Post()
  async createUser(@Body() data: User) {
    console.log('data: ', data);
    try {
      if (!data.email || !data.password || !data.name) {
        throw new HttpException(
          'All fields are required',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const user = await this.userService.createUser(data);

        if (user && user !== null) {
          return user;
        } else {
          throw new HttpException(
            'A user with this name already exists',
            HttpStatus.CONFLICT,
          );
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Update user
  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<User>,
  ) {
    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return await this.userService.updateUser(id, data as User);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Delete user
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return await this.userService.deleteUser(id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
