import { Injectable } from '@nestjs/common';

// Simple mock data
const users = [
  { id: '1', email: 'manager@slooze.com', password: 'password123', role: 'MANAGER' },
  { id: '2', email: 'store@slooze.com', password: 'password123', role: 'STORE_KEEPER' },
];

const products = [
  { id: '1', name: 'Wheat', price: 50, quantity: 100, createdById: '1' },
  { id: '2', name: 'Rice', price: 60, quantity: 80, createdById: '1' },
];

@Injectable()
export class PrismaService {
  async userFindUnique(args: any) {
    const user = users.find(u => u.email === args.where.email);
    return user || null;
  }

  async productFindMany() {
    return products.map(product => ({
      ...product,
      createdBy: users.find(u => u.id === product.createdById),
    }));
  }

  async productFindUnique(args: any) {
    const product = products.find(p => p.id === args.where.id);
    if (!product) return null;
    return {
      ...product,
      createdBy: users.find(u => u.id === product.createdById),
    };
  }

  async productCreate(args: any) {
    const newProduct = {
      ...args.data,
      id: String(products.length + 1),
    };
    products.push(newProduct);
    return {
      ...newProduct,
      createdBy: users.find(u => u.id === newProduct.createdById),
    };
  }

  async productUpdate(args: any) {
    const index = products.findIndex(p => p.id === args.where.id);
    if (index === -1) throw new Error('Product not found');
    
    products[index] = { ...products[index], ...args.data };
    return {
      ...products[index],
      createdBy: users.find(u => u.id === products[index].createdById),
    };
  }

  async productDelete(args: any) {
    const index = products.findIndex(p => p.id === args.where.id);
    if (index === -1) throw new Error('Product not found');
    
    const deleted = products.splice(index, 1)[0];
    return deleted;
  }

  async productCount() {
    return products.length;
  }

  async productAggregate(args: any) {
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    return { _sum: { quantity: totalQuantity } };
  }

  async $connect() {
    console.log('Mock database connected');
  }

  async $disconnect() {
    console.log('Mock database disconnected');
  }
}
