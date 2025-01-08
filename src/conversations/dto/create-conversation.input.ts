import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';
import { GraphQLUUID } from 'graphql-scalars';

@InputType()
export class CreateConversationInput {
  @Field(() => GraphQLUUID, { nullable: true })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  model?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  max_tokens?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  temperature?: number;
}
