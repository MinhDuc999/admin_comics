// src/users/user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(id: string | number): Promise<User | null> {
    // Safe type handling
    return this.usersRepository.findOne({
      where: { id: typeof id === 'string' ? id : id.toString() },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { googleId },
    });
  }

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async createUserFromGoogle(
    email: string,
    fullName: string,
    googleId: string,
    avatar?: string,
  ): Promise<User> {
    const userData = {
      email,
      fullName,
      googleId,
      avatar,
      isEmailVerified: true,
    };

    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }
}
