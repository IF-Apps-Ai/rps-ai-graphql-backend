import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response.dto';
import { ApolloError } from 'apollo-server-express';
import { SigninUserInput } from './dto/signin-user.input';
import { SigninResponse } from './dto/signin-response';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    try {
      return await this.authService.login({ username, password });
    } catch (e) {
      // Melemparkan ApolloError dengan kode UNAUTHORIZED
      throw new ApolloError(e.message, 'UNAUTHORIZED');
    }
  }

  @Mutation(() => SigninResponse)
  async signin(
    @Args('loginUserInput') loginUserInput: SigninUserInput,
    // @Context() Context,
  ): Promise<SigninResponse> {
    // Assume that authService.signin expects an object with username property
    return this.authService.signin(loginUserInput);
  }
}
