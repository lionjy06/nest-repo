import { ApiProperty } from '@nestjs/swagger';
import { userInfo } from 'os';
import { Contact } from 'src/apis/contact/entities/contact.entity';
import { Meeting } from 'src/apis/meeting/entities/meeting.entity';
import { Order } from 'src/apis/order/entities/order.entity';
import { Product } from 'src/apis/products/entities/product.entity';
import { Todo } from 'src/apis/todos/entities/todo.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  age: number;

  @Column()
  @ApiProperty()
  email: string;

  @Column()
  password: string;

  @Column()
  @ApiProperty()
  phoneNumber:string

  //self 참조(= self referencing)
  // 판매자도 유저이고 구매자도 유저인 상황에서 둘다 유저를 참조해야한다. 이럴때 유저 엔티티안에서 유저를 참조하기때문에 셀프 참조라고 한다.
  @OneToMany(() => User, (user) => user.buyer)
  seller: User;

  @ManyToOne(() => User, (user) => user.seller, { onDelete: 'SET NULL' })
  buyer: User[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, (order) => order.user)
  order: Order[];

  @OneToMany(() => Todo, (todo) => todo.user)
  todo: Todo[];

  @OneToOne(() => Contact, (contact) => contact.user)
  contact: Contact;

  //jointable을 걸어주는 쪽이 종속관계에서 주인이라고 생각하면 될것같다.
  // 유저가 미팅을 갖는거지 미팅이 유저를 갖는것은 아니기 때문
  @ManyToMany(() => Meeting, (meeting) => meeting.user)
  @JoinTable({ name: 'user_meeting' })
  meeting: Meeting[];
  //다대다 한계 극복어떻게 한계를 극복할까.연결 테이블용 엔티티를 추가한다. 사실상 연결 테이블을 엔티티로 승격시킨다.그리고 @ManyToMany를 각각 일대다, 다대일로 관계를 맺어준다.사실 개인적으로 이부분에 대해서는 @ManyToOne, 다대일 관계 두개로 풀어낸다는 표현이 맞는 것 같다.앞서 일대다 관계를 학습할 때, 결론적으로 다대일 양방향 매핑을 사용하자는 결론을 내기도 했고,실제로 아래의 코드상으로 봐도 FK 2개를 중간테이블에서 관리하고, @ManyToOne 양방향 매핑 2개로 이어져있다.테이블의 배치 순서상(Member -> MemberProduct(Order) -> Product) 표현을 @OneToMany, @ManyToOne으로 표현했던 것이라면 이해가 간다.

  @OneToMany(() => Product, (product) => product.user)
  product: Product[];
}
