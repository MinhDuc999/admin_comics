// src/interfaces/index.ts
export interface IComic {
  id: number;
  title: string;
  author: string;
  image: string;
  favorite: boolean;
  star: string;
  detailComics?: IDetailComic[];
}

export interface IDetailComic {
  id: number;
  comicId: number;
  sourceRead: string[];
  sourceAudio: string[];
  comic?: IComic;
}
