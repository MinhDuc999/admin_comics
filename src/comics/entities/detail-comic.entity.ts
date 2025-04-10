import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ComicEntity } from './comic.entity';

@Entity('detail_comics')
export class DetailComicEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comicId: number;

  @ManyToOne(() => ComicEntity, (comic) => comic.detailComics)
  @JoinColumn({ name: 'comicId' })
  comic: ComicEntity;

  @Column('simple-json', { nullable: true })
  sourceRead: string[];

  @Column('simple-json', { nullable: true })
  sourceAudio: string[];
}
