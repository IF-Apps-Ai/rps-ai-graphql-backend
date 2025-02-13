import { Global, Module } from '@nestjs/common';
import { DatabaseProviders } from './database.providers';
import { MongodbProviders } from './mongodb.providers';

@Global()
@Module({
  imports: [...MongodbProviders],
  providers: [...DatabaseProviders],
  exports: [...DatabaseProviders, ...MongodbProviders],
})
export class DatabaseModule {}
