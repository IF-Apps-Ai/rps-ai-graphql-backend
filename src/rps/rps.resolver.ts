import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { RpsService } from './rps.service';
import { GenerateRpsInput } from './dto/generate-rps.input';
import { RpsModel } from './models/rps.model';

@Resolver(() => RpsModel)
export class RpsResolver {
  constructor(private readonly rpsService: RpsService) {}

  @Mutation(() => RpsModel)
  async generateRps(@Args('input') input: GenerateRpsInput): Promise<RpsModel> {
    return this.rpsService.generateRps(input.prompt);
  }
}
