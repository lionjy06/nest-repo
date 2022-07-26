import { ApiProperty } from '@nestjs/swagger';
import { Order } from 'src/apis/order/entities/order.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  price: number;

  @Column()
  @ApiProperty()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Order, (order) => order.product)
  @JoinTable()
  order: Order[];

  @ManyToOne(() => User, (user) => user.product)
  user:User
}
