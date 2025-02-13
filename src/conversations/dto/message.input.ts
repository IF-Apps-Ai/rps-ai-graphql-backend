import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsString, ValidateNested } from 'class-validator';
import { MetadataInput } from './metadata.input';
import { Type } from 'class-transformer';

export enum Role {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
}

@InputType()
export class MessageInput {
  @Field()
  @IsEnum(Role)
  role: Role;

  @Field()
  @IsString()
  content: string;

  @Field(() => MetadataInput, { nullable: true })
  @ValidateNested()
  @Type(() => MetadataInput)
  metadata?: MetadataInput;
}
