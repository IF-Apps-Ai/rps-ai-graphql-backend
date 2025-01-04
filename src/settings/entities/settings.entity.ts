import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'settings' })
export class Settings {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  @Field(() => String, {
    nullable: false,
    description: 'Key',
  })
  key: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, {
    nullable: true,
    description: 'Values',
  })
  values: string;
}
