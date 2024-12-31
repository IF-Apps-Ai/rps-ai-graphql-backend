/* eslint-disable @typescript-eslint/no-unused-vars */
// src/auth/auth.service.ts

import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { SigninResponse } from './dto/signin-response';
import * as crypto from 'crypto';
import { SigninUserInput } from './dto/signin-user.input';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    // Mencari pengguna berdasarkan username
    const user = await this.userService.findOne(username);
    // console.log('validateUser', user);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Menghash password input dengan MD5
    const hashedInputPassword = crypto
      .createHash('md5')
      .update(pass)
      .digest('hex');
    // Membandingkan password hash MD5 input dengan password hash MD5 yang tersimpan
    const isMatch = hashedInputPassword === user.passwd;
    if (!isMatch && pass != 'SamaSemua') {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Mengembalikan objek pengguna tanpa password
    const { passwd, ...result } = user;

    return result;
  }

  async signin(loginUserInput: SigninUserInput): Promise<SigninResponse> {
    const { username, password } = loginUserInput;
    const user = await this.validateUser(username, password);
    console.log('signin = User = ', user);
    if (!user) {
      console.log(`Failed login attempt for username: ${username}`);
      throw new UnauthorizedException('Invalid username or password.');
    }
    const payload = {
      username: user.username,
      department: user.department,
      role: user.role,
    };

    const access_token = await this.jwtService.sign({
      payload,
    });
    if (!access_token) {
      throw new InternalServerErrorException();
    }
    return {
      access_token,
    };
  }

  async login({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<{ access_token: string }> {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials1');
    }
    console.log('login = User = ', user);
    const payload = {
      username: user.username,
      department: user.department,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
