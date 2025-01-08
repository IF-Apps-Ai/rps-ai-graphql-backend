import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Metadata } from './metadata.model';

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field()
  role: string;

  @Field()
  content: string;

  @Field()
  metadata: Metadata;
}
