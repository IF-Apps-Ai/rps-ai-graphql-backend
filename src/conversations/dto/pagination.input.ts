import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field(() => Int)
  @IsInt()
  @Min(0)
  offset: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  limit: number;
}
