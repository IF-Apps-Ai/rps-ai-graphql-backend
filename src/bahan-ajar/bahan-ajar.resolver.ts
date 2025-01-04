import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BahanAjarService } from './bahan-ajar.service';
import { BahanAjarModel } from './models/bahan-ajar.model';
import { GenerateBahanAjarInput } from './dto/generate-bahan-ajar.input';

@Resolver()
export class BahanAjarResolver {
  constructor(private readonly bahanAjarService: BahanAjarService) {}

  @Mutation(() => BahanAjarModel)
  async generateBahanAjar(
    @Args('input') input: GenerateBahanAjarInput,
  ): Promise<BahanAjarModel> {
    return this.bahanAjarService.GenerateBahanAjar(input);
  }
}
