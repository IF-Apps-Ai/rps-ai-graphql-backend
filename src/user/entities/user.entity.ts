// src/user/user.entity.ts

import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'auth_moodle_sync' })
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
  @Column({ name: 'passwd', nullable: true })
  passwd: string;

  @Field(() => String, {
    nullable: true,
    description: 'Nama Lengkap',
  })
  @Column({ name: 'fullname', nullable: true })
  fullname: string;

  @Field(() => String, {
    nullable: true,
    description: 'Department',
  })
  @Column({ name: 'department', nullable: true })
  department: string;

  @Field(() => String, {
    nullable: true,
    description: 'Role',
  })
  @Column({ name: 'role', nullable: true })
  role: string;
}
