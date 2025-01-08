import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';

export enum Role {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
}

@InputType()
export class AddMessageInput {
  @Field()
  @IsEnum(Role)
  role: Role;

  @Field()
  @IsString()
  content: string;
}
