import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../auth/dto/auth.response';

@ObjectType()
export class Product {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  quantity: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User)
  createdBy: User;
}
