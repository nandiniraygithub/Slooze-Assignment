import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DashboardStats {
  @Field()
  totalProducts: number;

  @Field()
  totalQuantity: number;
}
