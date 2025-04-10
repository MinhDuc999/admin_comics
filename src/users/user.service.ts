import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userRepository.findByGoogleId(googleId);
  }

  async create(userData: {
    email: string;
    fullName?: string;
    googleId?: string;
    avatar?: string;
  }): Promise<User> {
    if (userData.googleId) {
      return this.userRepository.createUserFromGoogle(
        userData.email,
        userData.fullName || userData.email.split('@')[0],
        userData.googleId,
        userData.avatar,
      );
    }

    const user = new User();
    user.email = userData.email;
    user.fullName = userData.fullName || userData.email.split('@')[0];
    user.avatar = userData.avatar;

    return this.userRepository.save(user);
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.findOne(id);
    if (user) {
      Object.assign(user, userData);
      return this.userRepository.save(user);
    }
    return null;
  }
}
