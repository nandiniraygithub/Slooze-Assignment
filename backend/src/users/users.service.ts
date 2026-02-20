import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  async create(userData: { email: string; password: string; role: Role }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }

  async findStoreKeepers() {
    return this.prisma.user.findMany({
      where: { role: Role.STORE_KEEPER },
      select: { id: true, email: true, role: true, createdAt: true },
    });
  }
}
