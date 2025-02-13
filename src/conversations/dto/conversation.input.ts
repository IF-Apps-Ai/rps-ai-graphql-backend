import { InputType, Field } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { GraphQLUUID } from 'graphql-scalars';
import { MessageInput } from './message.input';
import { Type } from 'class-transformer';

@InputType()
export class ConversationInput {
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

  @Field(() => [MessageInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MessageInput)
  messages?: MessageInput[];

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  max_tokens?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  temperature?: number;
}
