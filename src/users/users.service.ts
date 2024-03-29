import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async create(createUserInput: CreateUserInput) {
    try {
      return await this.usersRepository.create({
        ...createUserInput,
        password: await this.hashPassword(createUserInput.password)
      })
    } catch (err) {
      if (err.message.includes('E11000')) {
        throw new UnprocessableEntityException('Email already exists')
      }
      throw err;

    }
  }

  async findAll() {
    return this.usersRepository.find({}) // Return all users from the database
  }

  async findOne(_id: string) {
    return this.usersRepository.findOne({ _id }) // Return the user with the given id
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    if (updateUserInput.password) {
      updateUserInput.password = await this.hashPassword(updateUserInput.password)
    }

    return this.usersRepository.findOneAndUpdate({ _id }, {
      $set: {
        ...updateUserInput
      }
    })
  }

  async remove(_id: string) {
    return this.usersRepository.findOneAndDelete({ _id }) // Delete the user with the given id
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email })

    const passwordIsValid = await bcrypt.compare(password, user.password)

    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return user
  }
}
