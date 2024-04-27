import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

// para llamarlo y que aparezca en la base de datos esto tengo que llamarlo y eso se hace desde app module en imports

@Entity()
export class ProductImage {


    @PrimaryGeneratedColumn()
    id: number;


    @Column('text')
    url: string;


    @ManyToOne(
        () => Product,
        (product) => product.images,
        {onDelete: 'CASCADE'}
    )
    product: Product

    //TODO  averiguar donde esta el productid en la tabla osea esta pero nose de donde saco ese nombre por ejemplo que se genera en la base de datos 
}