import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Metadata } from './metadata.model';

@ObjectType()
export class ContentElement {
  @Field()
  type: string;

  @Field()
  text: string;
}

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field()
  role: string;

  // Now using an array of ContentElement instead of a simple string.
  @Field(() => [ContentElement])
  content: ContentElement[];

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}
