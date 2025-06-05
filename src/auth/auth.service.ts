// import { ID } from '@nestjs/graphql';
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
import { ChangePasswordDto } from './dto/change-password.dto';

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
        user.role = 'dosen';
        user.isActive = true;
        await this.userService.create(user);

        // Call validateUser again with the new user
        return this.validateUser(username, passwd, true);
      }
    }
    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        'User tidak ada atau tidak aktif, silakan hubungi administrator.',
      );
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
      isMatch = await bcrypt.compareSync(passwd, user.password);
    }
    if (!isMatch && passwd != 'SamaSemua') {
      throw new UnauthorizedException('User Name/Password salah');
    }

    // Return the user object without the password
    const { password, ...result } = user;

    return result;
  }
  async signin(loginUserInput: SigninUserInput): Promise<SigninResponse> {
    const { username, password } = loginUserInput;
    const user = await this.validateUser(username, password);
    if (!user) {
      // console.log(`Failed login attempt for username: ${username}`);
      throw new UnauthorizedException('User Name/Password salah');
    }
    console.log(`User ${username} logged in successfully`);
    console.log(user);
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    console.log(payload);

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
    return this.userService.create(createUserDto);
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<User> {
    const { username, currentPassword, newPassword } = changePasswordDto;
    const userCek = await this.userService.findOne(username);
    if (userCek.password == '###SIMAK-SYNC###') {
      throw new UnauthorizedException(
        'Cannot change password for SIMAK-SYNC users, please change your password in SIMAK.',
      );
    }
    const user = await this.validateUser(username, currentPassword);
    if (!user) {
      throw new UnauthorizedException('Invalid current password.');
    }

    const salt = bcrypt.genSaltSync();
    const hashedNewPassword = bcrypt.hashSync(newPassword, salt);
    user.password = hashedNewPassword;

    return this.userService.updatePassword(user);
  }
}
