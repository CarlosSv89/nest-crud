import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleInit } from '@nestjs/common';

// OnModuleInit to run the code when the module is initialized
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // Connect to the database when the module is initialized
    this.$connect();
  }
}
