import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@ObjectType() // Menandakan bahwa entitas ini adalah tipe GraphQL
@Entity('dosen')
export class Dosen {
  @Field(() => ID) // Menentukan field sebagai ID di GraphQL
  @PrimaryColumn({ type: 'varchar', length: 20 })
  nidn: string;

  @Field() // Menandakan field ini tersedia di schema GraphQL
  @Column({ type: 'varchar', length: 255 })
  pwd: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  nama: string;

  @Field({ nullable: true }) // Nullable di GraphQL sesuai dengan database
  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 15, nullable: true })
  hp: string;
}
