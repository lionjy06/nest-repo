import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/apis/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Contact {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id:string

    @ApiProperty()
    @Column()
    num:string

    @ApiProperty()
    @Column()
    address:string

    @ApiProperty()
    @Column()
    zipCode:number

    @CreateDateColumn()
    createdAt:Date

    @DeleteDateColumn()
    deletedAt:Date

    @UpdateDateColumn()
    updatedAt:Date

    //onDelete:'CASCADE' => 현재 유저와 연락처가 연결되있으며 유저가 삭제되면 해당 유저의 연락처도 같이 사라지게하는 옵션
    @OneToOne(() => User, (user) => user.contact,{onDelete:'CASCADE'})
    @JoinColumn()
    user:User
}
