import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  price?: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
