import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BahanAjarService } from './bahan-ajar.service';
import { BahanAjarModel } from './models/bahan-ajar.model';
import { GenerateBahanAjarInput } from './dto/generate-bahan-ajar.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { BahanAjarBaseModel } from './models/bahan-ajar.base.model';

@Resolver()
export class BahanAjarResolver {
  constructor(private readonly bahanAjarService: BahanAjarService) {}

  @Mutation(() => BahanAjarModel)
  async generateBahanAjar(
    @Args('input') input: GenerateBahanAjarInput,
  ): Promise<BahanAjarModel> {
    return this.bahanAjarService.GenerateBahanAjar(input);
  }

  @Mutation(() => BahanAjarModel)
  @UseGuards(GqlAuthGuard)
  async generateBahanAjarGuard(
    @Args('input') input: GenerateBahanAjarInput,
    @CurrentUser() user: any, // Adjust the type based on your user object
  ): Promise<BahanAjarModel> {
    console.log('Authenticated user:', user); // Access user information here
    return this.bahanAjarService.GenerateBahanAjarGuard(input, user);
  }

  @Mutation(() => BahanAjarBaseModel)
  @UseGuards(GqlAuthGuard)
  async generateBahanAjarBase(
    @Args('input') input: GenerateBahanAjarInput,
    @CurrentUser() user: any, // Adjust the type based on your user object
  ): Promise<BahanAjarBaseModel> {
    console.log('Authenticated user:', user); // Access user information here
    return this.bahanAjarService.GenerateBahanAjarBase(input, user);
  }
}
