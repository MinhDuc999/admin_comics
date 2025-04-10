import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DetailComicEntity } from './detail-comic.entity';

@Entity('comics')
export class ComicEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  image: string;

  @Column({ default: false })
  favorite: boolean;

  @Column('decimal', { precision: 3, scale: 1 })
  star: number;

  @OneToMany(() => DetailComicEntity, (detailComic) => detailComic.comic)
  detailComics: DetailComicEntity[];
}
