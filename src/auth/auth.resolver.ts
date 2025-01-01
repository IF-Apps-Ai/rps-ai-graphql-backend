import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
// import { LoginResponse } from './dto/login-response.dto';
// import { ApolloError } from 'apollo-server-express';
import { SigninUserInput } from './dto/signin-user.input';
import { SigninResponse } from './dto/signin-response';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';

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
    console.log(
      'Resolver - signin - loginUserInput.password :',
      loginUserInput.password,
    );
    return this.authService.signin(loginUserInput);
  }
}
