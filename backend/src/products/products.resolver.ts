import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './dto/product.type';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { DashboardStats } from './dto/dashboard-stats.type';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}

  @Query(() => [Product])
  async products() {
    return this.productsService.findAll();
  }

  @Query(() => Product, { nullable: true })
  async product(@Args('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Mutation(() => Product)
  async createProduct(@Args('createProductInput') createProductInput: CreateProductInput) {
    return this.productsService.create(createProductInput);
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('id') id: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productsService.update(id, updateProductInput);
  }

  @Mutation(() => Product)
  async removeProduct(@Args('id') id: string) {
    return this.productsService.remove(id);
  }

  @Query(() => DashboardStats)
  async dashboardStats() {
    return this.productsService.getStats();
  }
}
