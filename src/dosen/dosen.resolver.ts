import { Resolver, Query, Args } from '@nestjs/graphql';
import { DosenService } from './dosen.service';
import { Dosen } from './entities/dosen.entity';

@Resolver(() => Dosen)
export class DosenResolver {
  constructor(private readonly dosenService: DosenService) {}

  @Query(() => Dosen, { name: 'dosen' })
  findOne(@Args('nidn', { type: () => String }) nidn: string): Promise<Dosen> {
    return this.dosenService.findOne(nidn);
  }
}
