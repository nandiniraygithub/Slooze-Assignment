import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  imageUrl?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  createdById: string;
}
