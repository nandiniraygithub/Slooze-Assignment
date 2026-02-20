import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.product.findMany({
      include: { createdBy: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { createdBy: true },
    });
  }

  async create(productData: { name: string; price: number; quantity: number; createdById: string }) {
    return this.prisma.product.create({
      data: productData,
      include: { createdBy: true },
    });
  }

  async update(id: string, productData: { name?: string; price?: number; quantity?: number }) {
    return this.prisma.product.update({
      where: { id },
      data: productData,
      include: { createdBy: true },
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async getStats() {
    const total = await this.prisma.product.count();
    const totalQuantity = await this.prisma.product.aggregate({
      _sum: { quantity: true },
    });

    return {
      totalProducts: total,
      totalQuantity: totalQuantity._sum.quantity || 0,
    };
  }
}
