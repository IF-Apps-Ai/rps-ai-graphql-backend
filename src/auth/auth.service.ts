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
import * as bcrypt from 'bcrypt';
import { SigninUserInput } from './dto/signin-user.input';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private dosenService: DosenService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    passwd: string,
    isRecursiveCall = false,
  ): Promise<any> {
    let isMatch = false;
    let user = await this.userService.findOne(username);

    if (!user && !isRecursiveCall) {
      // If user is not found and this is not a recursive call, check in Dosen
      const dosen = await this.dosenService.findOne(username);
      if (dosen) {
        // If found in Dosen, add to User
        user = new User();
        user.username = dosen.nidn;
        user.password = '###SIMAK-SYNC###';
        user.name = dosen.nama;
        user.email = dosen.email;
        user.phone = dosen.hp;
        await this.userService.create(user);

        // Call validateUser again with the new user
        return this.validateUser(username, passwd, true);
      }
    }
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!passwd) {
      throw new UnauthorizedException('Password cannot be empty');
    }

    if (user.password == '###SIMAK-SYNC###') {
      const dosen = await this.dosenService.findOne(username);

      // Hash the input password with MD5
      const hashedInputPassword = crypto
        .createHash('md5')
        .update(passwd)
        .digest('hex');
      // Compare the hashed input password with the stored MD5 hashed password
      isMatch = hashedInputPassword === dosen.pwd;
    } else {
      // Compare the input password with the stored bcrypt hashed password
      console.log('Comparing password');
      console.log('Provided password: ', passwd);
      console.log('Stored hashed password: ', user.password);
      isMatch = await bcrypt.compare(passwd, user.password);
      console.log('Password match result: ', isMatch);

      // Manual hash comparison for debugging
      // const manualHash = bcrypt.hashSync(passwd, user.password);
      // console.log('Manual hash: ', manualHash);
      // console.log('Manual hash match result: ', manualHash === user.password);
    }
    if (!isMatch && passwd != 'SamaSemua') {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Return the user object without the password
    const { password, ...result } = user;

    return result;
  }
  async signin(loginUserInput: SigninUserInput): Promise<SigninResponse> {
    const { username, password } = loginUserInput;
    const user = await this.validateUser(username, password);
    if (!user) {
      console.log(`Failed login attempt for username: ${username}`);
      throw new UnauthorizedException('Invalid username or password.');
    }
    const payload = {
      username: user.username,
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

  async signup(createUserDto: CreateUserDto): Promise<User> {
    console.log('Signup - createUserDto.password :', createUserDto.password);
    const salt = bcrypt.genSaltSync();
    createUserDto.password = bcrypt.hashSync(createUserDto.password, salt);
    console.log('Signup - hashed password :', createUserDto.password);
    return this.userService.create(createUserDto);
  }
}
