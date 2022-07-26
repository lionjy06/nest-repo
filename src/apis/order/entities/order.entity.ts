import { ApiProperty } from "@nestjs/swagger";
import { type } from "os";
import { Product } from "src/apis/products/entities/product.entity";
import { User } from "src/apis/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Order {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id:string

    @ApiProperty({nullable:true})
    @Column({nullable:true})
    shipVia:string

    @ManyToOne(()=> User, (user) => user.order)
    user:User

    @OneToMany(() => Product, (product) => product.order)
    product:Product[]

    @CreateDateColumn()
    createdAt:Date

    @DeleteDateColumn()
    deletedAt:Date

    @UpdateDateColumn()
    updatedAt:Date

}
