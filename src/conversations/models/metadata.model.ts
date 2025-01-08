import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Metadata {
  @Field()
  request_id: string;

  @Field()
  model: string;

  @Field()
  temperature: number;

  @Field()
  max_completion_tokens: number;

  @Field()
  top_p: number;

  @Field()
  frequency_penalty: number;

  @Field()
  presence_penalty: number;

  @Field()
  prompt_tokens_used: number;

  @Field()
  completion_tokens_used: number;

  @Field()
  timestamp: string;
}
