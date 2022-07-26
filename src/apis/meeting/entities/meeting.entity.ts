import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/apis/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Meeting {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id:string

    @ApiProperty()
    @Column()
    name:string

    @ApiProperty()
    @Column()
    description:string

    @CreateDateColumn()
    createdAt:Date

    @DeleteDateColumn()
    deletedAt:Date

    @UpdateDateColumn()
    updatedAt:Date

    //many to many는 알아서 onDelete cascade가 된다
    @ManyToMany(() => User, (user) => user.meeting)
    user:User[]

}
