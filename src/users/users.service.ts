import { Injectable } from '@nestjs/common';
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
    return this.usersRepository.create({
      ...createUserInput,
      password: await this.hashPassword(createUserInput.password)
    })
  }

  async findAll() {
    return this.usersRepository.find({}) // Return all users from the database
  }

  async findOne(_id: string) {
    return this.usersRepository.findOne({ _id }) // Return the user with the given id
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    return this.usersRepository.findOneAndUpdate({ _id }, {
      $set: {
        ...updateUserInput,
        password: await this.hashPassword(updateUserInput.password)
      }
    })
  }

  async remove(_id: string) {
    return this.usersRepository.findOneAndDelete({ _id }) // Delete the user with the given id
  }
}
