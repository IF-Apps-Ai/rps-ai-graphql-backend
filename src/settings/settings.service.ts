import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Settings } from './entities/settings.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class SettingsService {
  private settingsRepository: Repository<Settings>;

  constructor(
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
  ) {
    this.settingsRepository = this.dataSource.getRepository(Settings);
  }

  async findOne(key: string): Promise<Settings | null> {
    const setting = await this.settingsRepository.findOne({
      where: { key },
    });
    return setting;
  }
}
