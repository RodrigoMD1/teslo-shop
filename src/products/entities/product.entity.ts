import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";

//* ENTITY la informacion que van a tener la base de datos 

@Entity() // dentro de los () de entity podes poner {name: 'products} para cambiarle el nombre a la tabla pero se puede borrar la base de datos creo 
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
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];


    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User



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


    //TODO PREGUNTAR esto solo sirve para el slug ahora si quiero que en title se aplique tengo que volver a crear todo lo de la linea 68 a 77 ??  

    @BeforeUpdate()
    checkSlugUpdate() {

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
            .replaceAll('.', '')

    }

}

