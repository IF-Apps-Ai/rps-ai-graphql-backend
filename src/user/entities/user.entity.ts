import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, {
    nullable: false,
    description: 'ID',
  })
  id: string;

  @Field(() => String, {
    nullable: true,
    description: 'Username',
  })
  @Column({ name: 'username', unique: true, nullable: true })
  username: string;

  @Field(() => String, {
    nullable: true,
    description: 'Password',
  })
  @Column({ name: 'password', nullable: true })
  password: string;

  @Field(() => String, {
    nullable: true,
    description: 'Nama Lengkap',
  })
  @Column({ name: 'name', nullable: true })
  name: string;

  @Field(() => String, {
    nullable: true,
    description: 'Email',
  })
  @Column({ name: 'email', unique: true, nullable: true })
  email: string;

  @Field(() => String, {
    nullable: true,
    description: 'Phone',
  })
  @Column({ name: 'phone', unique: true, nullable: true })
  phone: string;

  @Field(() => String, {
    nullable: true,
    description: 'Descriptions',
  })
  @Column({ name: 'descriptions', nullable: true })
  descriptions: string;

  @Field(() => String, {
    nullable: true,
    description: 'Role',
  })
  @Column({ name: 'role', nullable: true })
  role: string;

  @Field(() => String, {
    nullable: true,
    description: 'Created By',
  })
  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Field(() => String, {
    nullable: true,
    description: 'Updated By',
  })
  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Is Activated',
  })
  @Column({ name: 'is_activated', default: true })
  isActive: boolean;

  @Field(() => Date, {
    nullable: true,
    description: 'Password Changed At',
  })
  @Column({
    name: 'password_changed_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  passwordChangedAt: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'Created At',
  })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'Updated At',
  })
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
