import { MongooseModule } from '@nestjs/mongoose';

export const MongodbProviders = [
  MongooseModule.forRoot(
    'mongodb://ai:SamaKemarin11@103.151.145.21:27005/conversationDB?authSource=admin',
  ),
];
