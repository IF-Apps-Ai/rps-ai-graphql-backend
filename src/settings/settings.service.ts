import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Settings } from './entities/settings.entity';
import { DataSource } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class SettingsService {
  private settingsRepository: Repository<Settings>;

  constructor(
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {
    this.settingsRepository = this.dataSource.getRepository(Settings);
  }

  async findOne(key: string): Promise<Settings | null> {
    const cacheKey = `settings:${key}`;

    // Try to get from cache first
    const cached = await this.cacheManager.get<Settings>(cacheKey);
    if (cached) {
      return cached;
    }

    // If not in cache, fetch from database
    const setting = await this.settingsRepository.findOne({
      where: { key },
    });

    // Cache the result for 5 minutes
    if (setting) {
      await this.cacheManager.set(cacheKey, setting, 300);
    }

    return setting;
  }

  async clearCache(key?: string): Promise<void> {
    if (key) {
      await this.cacheManager.del(`settings:${key}`);
    }
    // Note: For full cache clearing, you might need to implement a more specific approach
    // depending on your cache manager implementation
  }
}
