import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid'


@Injectable()
export class ProductsService {


  private readonly logger = new Logger('ProductsService') // * esto permite mostrar los errores mas claramente en la terminal 

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }



  ////////////////////////////////////////////////////////////////////////////////////////////
  async create(createProductDto: CreateProductDto) {

    try {

      const product = this.productRepository.create(createProductDto); //*esto lo crea pero no lo guarda en la base de datos
      await this.productRepository.save(product); // *esto lo guarda en la base de datos 

      return product;

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  ////////////////////////////////////////////////////////////////////////////////////////////

  findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto

    return this.productRepository.find({
      take: limit,
      skip: offset,
      //TODO: relaciones
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////

  async findOne(term: string) {

    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });// buscar por id
    } else {
      //product = await this.productRepository.findOneBy({ slug: term });// buscar por slug

      const queryBuilder = this.productRepository.createQueryBuilder();// esto hace que el buscador sea mas seguro en la url para que signos vacios o raros no se injecten sql
      product = await queryBuilder
      
        .where('UPPER(title) = :title or slug =:slug', // :title poner los dos puntos juntos y no separados por que sino salta error 
          {
            title: term.toUpperCase(),
            slug: term.toLowerCase(),
          }).getOne();

    }

    //const product = await this.productRepository.findOneBy({ id });

    if (!product)
      throw new NotFoundException(`product with id ${term} not found`)

    return product;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////

  async update(id: string, updateProductDto: UpdateProductDto) {


    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    if (!product) throw new NotFoundException(`product with id ${id} not found `)

    try {

      return this.productRepository.save(product)

    } catch (error) {

      this.handleDBExceptions(error);

    }



  }

  ////////////////////////////////////////////////////////////////////////////////////////////

  async remove(id: string) {

    const product = await this.findOne(id);

    await this.productRepository.remove(product);

  }

  ////////////////////////////////////////////////////////////////////////////////////////////






  private handleDBExceptions(error: any) {
    //* toda esta funcion de handleDBExceptions es para mostrar el erro mas en especifico 

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error); //* aca se llama a los errores mas limpios de la consola se puede usar en todo el archivo de service 
    throw new InternalServerErrorException('Unexpected error,check server logs')

  }


}
