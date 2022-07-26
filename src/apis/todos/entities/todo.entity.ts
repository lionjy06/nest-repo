import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/apis/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Todo {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id:string

    @ApiProperty()
    @Column()
    task:string

    @ApiProperty()
    @Column()
    description:string

    @CreateDateColumn()
    createdAt:Date
  
    @DeleteDateColumn()
    deletedAt:Date
  
    @UpdateDateColumn()
    updatedAt:Date

    //onDelete:SET NULL 은 유저가 삭제될시 NULL값으로 바꾸어 todo에 누군가를 다시 세팅하게 할수있다.
    @ManyToOne(() => User, (user) => user.todo, {onDelete:'SET NULL'})
    user:User
}
