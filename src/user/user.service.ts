import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';
import { UserProfile } from './dto/user-profile.dto';

@Injectable()
export class UserService {
  private userRepository: Repository<User>;

  constructor(
    @Inject('SIMAK_DATA_SOURCE') // DataSource untuk Database SIMAK
    private simakDataSource: DataSource,
  ) {
    this.userRepository = this.simakDataSource.getRepository(User);
  }

  async findOne(username: string): Promise<User | null> {
    console.log('UserService.findOne', username);
    const result = await this.userRepository.findOne({
      where: { username: username },
    });
    console.log('UserService.findOne', result);
    return result;
  }

  async getUser(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User ${username} not found.`);
    }
    return user;
  }

  async getUserProfile(username: string): Promise<UserProfile> {
    console.log('Profile');
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      username: user.username,
      fullname: user.fullname,
      department: user.department,
      role: user.role,
    };
  }
}
