import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';
import { Message } from './message.model';

@ObjectType()
export class Conversation {
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLUUID, { nullable: true })
  userId?: string;

  @Field({ nullable: true })
  title?: string;

  @Field(() => [Message])
  messages: Message[];

  @Field({ nullable: true })
  model?: string;

  @Field({ nullable: true })
  max_tokens?: number;

  @Field({ nullable: true })
  temperature?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
