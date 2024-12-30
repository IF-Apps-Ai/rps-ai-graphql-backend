import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GenerateRpsInput {
  @Field()
  prompt: string;
}
