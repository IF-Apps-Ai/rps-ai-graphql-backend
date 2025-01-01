// src/user/user.entity.ts

import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'users' })
export class User {
  @PrimaryColumn({ name: 'username' })
  @Field(() => String, {
    nullable: false,
    description: 'Username',
  })
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
  @Column({ name: 'email', nullable: true })
  email: string;

  @Field(() => String, {
    nullable: true,
    description: 'Phone',
  })
  @Column({ name: 'phone', nullable: true })
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
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  passwordChangedAt: Date;
}
