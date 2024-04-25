import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

//* ENTITY la informacion que van a tener la base de datos 

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    title: string;

    @Column('float', {
        default: 0 // esto para que venga por defecto en 0 el precio de todas los productos 
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column('text', {
        unique: true
    })
    slug: string;

    @Column('int', {
        default: 0
    })
    stock: number;

    @Column('text', {
        array: true   //esto es un arreglo en string
    })
    sizes: string[]

    @Column('text')
    gender: string;

    @Column('text', {
        array: true,
        default: []
    }
    )
    tags: string[]

    //images
    @OneToMany(
        ()=> ProductImage,
        (productImage)=> productImage.product,
        {cascade:true}
    )
    images?: ProductImage[];



    @BeforeInsert()
    checkSlugInsert() {

        //* esto sirve para cuando por ejemplo en slug pones hola mundo con ese espacio en el medio esto lo cambia por hola_mundo para que no queden espacios vacios

        if (!this.slug) {
            this.slug = this.title

        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
            .replaceAll('.', '')
    }




    @BeforeUpdate()
    checkSlugUpdate() {

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
            .replaceAll('.', '')

    }

}

