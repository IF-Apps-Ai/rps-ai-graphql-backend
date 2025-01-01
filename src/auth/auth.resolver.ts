import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
// import { LoginResponse } from './dto/login-response.dto';
// import { ApolloError } from 'apollo-server-express';
import { SigninUserInput } from './dto/signin-user.input';
import { SigninResponse } from './dto/signin-response';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => User)
  async signup(
    @Args('createUserInput') createUserDto: CreateUserDto,
  ): Promise<User> {
    console.log('Resolver - createUserDto.password :', createUserDto.password);
    return this.authService.signup(createUserDto);
  }

  @Mutation(() => SigninResponse)
  async signin(
    @Args('loginUserInput') loginUserInput: SigninUserInput,
  ): Promise<SigninResponse> {
    return this.authService.signin(loginUserInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async changePassword(
    @Args('changePasswordInput') changePasswordDto: ChangePasswordDto,
    @Context() context,
  ): Promise<User> {
    const { username } = context.req.user;
    if (username !== changePasswordDto.username) {
      throw new UnauthorizedException('You can only change your own password.');
    }
    return this.authService.changePassword(changePasswordDto);
  }
}
