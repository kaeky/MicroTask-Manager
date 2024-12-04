import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dim_user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  auth0Id: string;

  @Column({ default: true })
  status: boolean;
}