import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>

  ) { }

  /////////////////////////////////////////////////////////
  async runSeed() {

    await this.deleteTables();
    const adminUser = await this.insertUsers();

    await this.inserNewProducts(adminUser);

    return 'Seed Executed ';
  }


  /////////////////////////////////////////////////////////
  // esto va a borrar todos los productos 
  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute()
  }

  /////////////////////////////////////////////////////////


  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user))
    });

    const dbUsers = await this.userRepository.save(seedUsers)

    return dbUsers[0];
  }

  /////////////////////////////////////////////////////////

  private async inserNewProducts(user: User) {
    await this.productsService.deleteAllProducts(); // esto para borrar todo 

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productsService.create(product, user))
    });

    await Promise.all(insertPromises);

    return true;
  }

  /////////////////////////////////////////////////////////


}
