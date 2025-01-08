import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserProfile {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  role?: string;
}
