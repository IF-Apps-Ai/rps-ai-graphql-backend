// src/users/user.resolver.ts

import { Resolver, Query, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserProfile } from './dto/user-profile.dto';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserProfile)
  @UseGuards(GqlAuthGuard)
  async profile(@Context() context: any): Promise<UserProfile> {
    if (!context.req.user) {
      throw new UnauthorizedException();
    }
    // asumsikan konteks request menyertakan objek pengguna yang terautentikasi
    const username = context.req.user.payload.username;
    return this.userService.getUserProfile(username);
  }
}
