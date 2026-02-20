import { Injectable } from '@nestjs/common';

// Mock data for testing
const mockUsers = [
  {
    id: '1',
    email: 'manager@slooze.com',
    password: '$2b$10$example_hashed_password',
    role: 'MANAGER',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'store@slooze.com',
    password: '$2b$10$example_hashed_password',
    role: 'STORE_KEEPER',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockProducts = [
  {
    id: '1',
    name: 'Wheat',
    price: 50,
    quantity: 100,
    createdById: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Rice',
    price: 60,
    quantity: 80,
    createdById: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

@Injectable()
export class PrismaService {
  get user() {
    return {
      findUnique: async (args: any) => {
        const user = mockUsers.find(u => u.email === args.where.email);
        return user || null;
      },
      findUniqueOrThrow: async (args: any) => {
        const user = mockUsers.find(u => u.id === args.where.id);
        if (!user) throw new Error('User not found');
        return user;
      },
    };
  }

  get product() {
    return {
      findMany: async () => {
        return mockProducts.map(product => ({
          ...product,
          createdBy: mockUsers.find(u => u.id === product.createdById),
        }));
      },
      findUnique: async (args: any) => {
        const product = mockProducts.find(p => p.id === args.where.id);
        if (!product) return null;
        return {
          ...product,
          createdBy: mockUsers.find(u => u.id === product.createdById),
        };
      },
      create: async (args: any) => {
        const newProduct = {
          ...args.data,
          id: String(mockProducts.length + 1),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockProducts.push(newProduct);
        return {
          ...newProduct,
          createdBy: mockUsers.find(u => u.id === newProduct.createdById),
        };
      },
      update: async (args: any) => {
        const index = mockProducts.findIndex(p => p.id === args.where.id);
        if (index === -1) throw new Error('Product not found');
        
        mockProducts[index] = {
          ...mockProducts[index],
          ...args.data,
          updatedAt: new Date(),
        };
        
        return {
          ...mockProducts[index],
          createdBy: mockUsers.find(u => u.id === mockProducts[index].createdById),
        };
      },
      delete: async (args: any) => {
        const index = mockProducts.findIndex(p => p.id === args.where.id);
        if (index === -1) throw new Error('Product not found');
        
        const deleted = mockProducts.splice(index, 1)[0];
        return deleted;
      },
      count: async () => {
        return mockProducts.length;
      },
      aggregate: async (args: any) => {
        const totalQuantity = mockProducts.reduce((sum, p) => sum + p.quantity, 0);
        return { _sum: { quantity: totalQuantity } };
      },
    };
  }

  async $connect() {
    console.log('Mock database connected');
  }

  async $disconnect() {
    console.log('Mock database disconnected');
  }
}
