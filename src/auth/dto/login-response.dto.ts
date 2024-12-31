// src/auth/dto/auth-response.dto.ts

import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
  @Field()
  access_token: string;
}
