import { Repository } from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOneWithLoginId({ loginId }) {
    return await this.usersRepository.findOne({
      where: { loginId },
    });
  }

  async findOneWithUserId({ userId }) {
    return await this.usersRepository.findOne({
      where: { id: userId },
    });
  }

  async findAll() {
    const result = await this.usersRepository.find();
    return result;
  }

  async create({ createUserInput }) {
    const { loginPass, ...user } = createUserInput;
    const encryptPass = await bcrypt.hash(loginPass, 10);
    const result = await this.usersRepository.save({
      ...user,
      loginPass: encryptPass,
    });
    return result;
  }

  async checkUserExist({ email }) {
    const result = await this.usersRepository.findOne({
      where: { email },
    });
    if (result) {
      throw new ConflictException('User already exists');
    }
  }

  async updatePwd({ userId, loginPass }) {
    const encryptPass = await bcrypt.hash(loginPass, 10);
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    const updateUser = {
      ...user,
      loginPass: encryptPass,
    };
    const result = await this.usersRepository.save(updateUser);
    return result ? true : false;
  }

  async update({ userId, updateUserInput }) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    const updateUser = {
      ...user,
      id: userId,
      ...updateUserInput,
    };
    const result = await this.usersRepository.save(updateUser);
    return result;
  }

  async softDelete({ userId }) {
    const result = await this.usersRepository.softDelete({ id: userId });
    return result.affected ? true : false;
  }

  async softDeleteWithLoginId({ loginId }) {
    const result = await this.usersRepository.softDelete({ loginId });
    return result.affected ? true : false;
  }

  async restore({ userId }) {
    const result = await this.usersRepository.restore({ id: userId });
    return result.affected ? true : false;
  }

  async hardDelete({ userId }) {
    const result = await this.usersRepository.delete({ id: userId });
    return result.affected ? true : false;
  }

  // show all users include deleted users
  async findAllWithDeleted() {
    const result = await this.usersRepository.find({
      withDeleted: true,
    });
    return result;
  }
}
