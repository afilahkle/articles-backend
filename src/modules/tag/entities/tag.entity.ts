import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'tags'})
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
