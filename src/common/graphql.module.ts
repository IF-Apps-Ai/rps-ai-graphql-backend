import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { FastifyRequest, FastifyReply } from 'fastify';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // autoSchemaFile: './schema.gql',  // Atau true untuk auto-generasi skema di memori
      autoSchemaFile: true, // Menggunakan auto-generasi schema
      context: ({
        req,
        reply,
      }: {
        req: FastifyRequest;
        reply: FastifyReply;
      }) => ({ req, reply }),
      // buildSchemaOptions: {
      //   dateScalarMode: 'timestamp',
      // },
    }),
  ],
  providers: [], // Tambahkan scalars atau provider lainnya jika dibutuhkan
})
export class GraphqlModule {}
