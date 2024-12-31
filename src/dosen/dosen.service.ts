import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Dosen } from './entities/dosen.entity';

@Injectable()
export class DosenService {
  private dosenRepository: Repository<Dosen>;

  constructor(
    @Inject('SIMAK_DATA_SOURCE') // DataSource untuk Database SIMAK
    private simakDataSource: DataSource,
  ) {
    this.dosenRepository = this.simakDataSource.getRepository(Dosen);
  }

  async findOne(nidn: string): Promise<Dosen | null> {
    const result = await this.dosenRepository.findOne({
      where: { nidn: nidn },
    });
    console.log('DosenService.findOne', result);
    return result;
  }
}
