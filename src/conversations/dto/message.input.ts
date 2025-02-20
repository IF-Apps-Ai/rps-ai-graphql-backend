import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MetadataInput } from './metadata.input';

export enum Role {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
}

@InputType()
export class ContentElementInput {
  @Field()
  @IsString()
  type: string;

  @Field()
  @IsString()
  text: string;
}

@InputType()
export class MessageInput {
  // Field id tidak diperlukan di sini karena akan di-generate oleh sistem
  @Field()
  @IsEnum(Role)
  role: Role;

  @Field(() => [ContentElementInput])
  @ValidateNested({ each: true })
  @Type(() => ContentElementInput)
  content: ContentElementInput[];

  @Field(() => MetadataInput, { nullable: true })
  @ValidateNested()
  @Type(() => MetadataInput)
  metadata?: MetadataInput;
}
