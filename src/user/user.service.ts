import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';
import { UserProfile } from './dto/user-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private usersRepository: Repository<User>;

  constructor(
    @Inject('DATA_SOURCE') // DataSource untuk Database SIMAK
    private dataSource: DataSource,
  ) {
    this.usersRepository = this.dataSource.getRepository(User);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password !== '###SIMAK-SYNC###') {
      const salt = bcrypt.genSaltSync();
      createUserDto.password = bcrypt.hashSync(createUserDto.password, salt);
    }

    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findOne(username: string): Promise<User | null> {
    const result = await this.usersRepository.findOne({
      where: { username: username },
    });
    return result;
  }

  async getUser(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User ${username} not found.`);
    }
    return user;
  }

  async getUserProfile(username: string): Promise<UserProfile> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
  }

  async updatePassword(user: User): Promise<User> {
    const updatedUser = await this.usersRepository.save(user);
    // const { password, ...result } = updatedUser;
    return updatedUser;
  }
}
