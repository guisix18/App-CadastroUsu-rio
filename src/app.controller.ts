import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { response } from 'express';
import { CreateUserBody } from './services/createuser.service';
import { PrismaService } from './services/prisma.service';

@Controller('user')
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  listUsers() {
    return this.prisma.user.findMany();
  }

  @Get(':id')
  async findOneUser(@Param('id') id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };
    }

    throw new NotFoundException('User not found');
  }

  @Post()
  async createUser(@Body() body: CreateUserBody) {
    const { name, email, password } = body;

    await this.prisma.user.create({
      data: {
        id: randomUUID(),
        name,
        email,
        password,
      },
    });
  }
}
