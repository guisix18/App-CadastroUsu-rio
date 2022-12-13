import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateUserBody } from './services/createuser.service';
import { PrismaService } from './services/prisma.service';

@Controller('user')
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  listUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }

  @Get(':id')
  async findOneUser(@Param('id') id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (user) {
      return user;
    }

    throw new NotFoundException('User not found');
  }

  @Post()
  async createUser(@Body() body: CreateUserBody) {
    const { name, email, password } = body;

    const findUser = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (findUser) {
      throw new BadRequestException('User already exists');
    }

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
