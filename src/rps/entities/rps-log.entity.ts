import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'rps_logs' })
export class RpsLog {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'uuid' })
  @Field(() => String)
  user_id: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  prompt_system: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  prompt_user: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  completions: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  json_response: string;

  @Column({ type: 'integer', nullable: true })
  @Field(() => Number, { nullable: true })
  prompt_tokens: number;

  @Column({ type: 'integer', nullable: true })
  @Field(() => Number, { nullable: true })
  completion_tokens: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field(() => String, { nullable: true })
  model: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @Field(() => Date)
  updated_at: Date;
}
