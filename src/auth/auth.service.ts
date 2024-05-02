import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';



@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto) {


    try {

      const user = this.userRepository.create(createUserDto);

      await this.userRepository.save(user)

      return user;


    } catch (error) {
      console.log(error);

    }


  }

}
