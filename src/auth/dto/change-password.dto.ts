import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class ChangePasswordDto {
  @Field(() => String)
  @IsString()
  username: string;

  @Field(() => String)
  @IsString()
  currentPassword: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  newPassword: string;
}
