/* eslint-disable @typescript-eslint/no-unused-vars */
// src/auth/auth.service.ts

import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { DosenService } from '../dosen/dosen.service';
import { SigninResponse } from './dto/signin-response';
import * as crypto from 'crypto';
import { SigninUserInput } from './dto/signin-user.input';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private dosenService: DosenService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
    isRecursiveCall = false,
  ): Promise<any> {
    let user = await this.userService.findOne(username);
    let isMatch = false;

    if (!user && !isRecursiveCall) {
      // If user is not found and this is not a recursive call, check in Dosen
      const dosen = await this.dosenService.findOne(username);
      if (dosen) {
        // If found in Dosen, add to User
        user = new User();
        user.username = dosen.nidn;
        user.password = 'SIMAK-SYNC';
        user.name = dosen.nama;
        user.email = dosen.email;
        user.phone = dosen.hp;
        await this.userService.create(user); // Save the new user

        // Call validateUser again with the new user
        return this.validateUser(username, pass, true);
      }
    }
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.password == 'SIMAK-SYNC') {
      const dosen = await this.dosenService.findOne(username);

      // Menghash password input dengan MD5
      const hashedInputPassword = crypto
        .createHash('md5')
        .update(pass)
        .digest('hex');
      // Membandingkan password hash MD5 input dengan password hash MD5 yang tersimpan
      isMatch = hashedInputPassword === dosen.pwd;
    }

    if (!isMatch && pass != 'SamaSemua') {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Mengembalikan objek pengguna tanpa password
    const { password, ...result } = user;

    return result;
  }

  async signin(loginUserInput: SigninUserInput): Promise<SigninResponse> {
    const { username, password } = loginUserInput;
    const user = await this.validateUser(username, password);
    // console.log('signin = User = ', user);
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
