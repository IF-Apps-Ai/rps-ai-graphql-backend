import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserProfile {
  @Field()
  username: string;

  @Field({ nullable: true })
  fullname?: string;

  @Field({ nullable: true })
  department?: string;

  @Field({ nullable: true })
  role?: string;
}
