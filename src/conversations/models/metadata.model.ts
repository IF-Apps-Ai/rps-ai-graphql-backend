import { ObjectType, Field } from '@nestjs/graphql';
import { IsString, IsNumber } from 'class-validator';

@ObjectType()
export class Metadata {
  @Field()
  @IsString()
  request_id: string;

  @Field()
  @IsString()
  model: string;

  @Field()
  @IsNumber()
  temperature: number;

  @Field()
  @IsNumber()
  max_completion_tokens: number;

  @Field()
  @IsNumber()
  top_p: number;

  @Field()
  @IsNumber()
  frequency_penalty: number;

  @Field()
  @IsNumber()
  presence_penalty: number;

  @Field()
  @IsString()
  timestamp: string;
}
