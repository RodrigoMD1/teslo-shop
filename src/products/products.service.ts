import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid'
import { ProductImage } from './entities/product-image.entity';


@Injectable()
export class ProductsService {


  private readonly logger = new Logger('ProductsService') // * esto permite mostrar los errores mas claramente en la terminal 

  constructor(

    //*SIEMPRE REVISAR QUE ESTAN BIEN ESCRITOS  LA PARTE DE Repository<Product> y el otro tambien 

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,

  ) { }



  ////////////////////////////////////////////////////////////////////////////////////////////
  async create(createProductDto: CreateProductDto) {

    try {
      const { images = [], ...productDetails } = createProductDto

      const product = this.productRepository.create(
        {
          ...productDetails,
          images: images.map(image => ({ url: image }) as DeepPartial<ProductImage>)
        }); //*esto lo crea pero no lo guarda en la base de datos


      await this.productRepository.save(product); // *esto lo guarda en la base de datos 

      return { ...product, images };

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  ////////////////////////////////////////////////////////////////////////////////////////////

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    });

    return products.map(product => ({
      ...product,
      images: product.images.map(img => img.url)
    }))
  }

  ////////////////////////////////////////////////////////////////////////////////////////////

  async findOne(term: string) {

    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });// buscar por id
    } else {
      //product = await this.productRepository.findOneBy({ slug: term });// buscar por slug

      const queryBuilder = this.productRepository.createQueryBuilder('prod');// esto hace que el buscador sea mas seguro en la url para que signos vacios o raros no se injecten sql
      product = await queryBuilder

        .where('UPPER(title) = :title or slug =:slug', // :title poner los dos puntos juntos y no separados por que sino salta error 
          {
            title: term.toUpperCase(),
            slug: term.toLowerCase(),
          })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();

    }
    //const product = await this.productRepository.findOneBy({ id });

    if (!product)
      throw new NotFoundException(`product with id ${term} not found`)

    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map(image => image.url)
    } // esto el findonePlain funciona para que se relacione con la base de datos de imagenes y esto como que suma la tabla normal y la de imagenes 
  }

  ////////////////////////////////////////////////////////////////////////////////////////////

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({ id, ...toUpdate });

    if (!product) throw new NotFoundException(`product with id ${id} not found `)

    // Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();


    try {

      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } })


        product.images = images.map(
          image => this.productImageRepository.create({ url: image })
        )
      }
      await queryRunner.manager.save(product);
      //      await this.productRepository.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release()

      return this.findOnePlain(id);

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

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


  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product')

    try {

      return await query
        .delete()
        .where({})
        .execute();

    } catch (error) {

      this.handleDBExceptions(error);

    }
    // esto es algo que solo es para desarollo o produccion  esto puede eliminar todos los productos de la base de datos tambien la de imagenes 


  }


}
