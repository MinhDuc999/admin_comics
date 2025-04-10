import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateGoogleUser(userData: {
    email: string;
    fullName: string;
    googleId: string;
    avatar?: string;
  }): Promise<User> {
    try {
      let user = await this.userService.findByEmail(userData.email);

      if (user) {
        if (!user.googleId) {
          const updatedUser = await this.userService.update(user.id, {
            googleId: userData.googleId,
            isEmailVerified: true,
            avatar: userData.avatar || user.avatar,
          });

          if (updatedUser) {
            user = updatedUser;
          }
        }
      } else {
        user = await this.userService.create({
          email: userData.email,
          fullName: userData.fullName,
          googleId: userData.googleId,
          avatar: userData.avatar,
        });
      }

      return user;
    } catch (error) {
      console.error('Error validating Google user:', error);
      throw new UnauthorizedException('Failed to validate user');
    }
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    await Promise.resolve();

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }
}
