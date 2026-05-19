export interface Movie {
  '#IMDB_ID': string;
  '#TITLE': string;
  '#YEAR': number | string;
  '#ACTORS': string;
  '#AKA': string;
  '#IMDB_URL': string;
  '#IMG_POSTER': string;
}

export interface WatchedMovie {
  imdbId: string;
  title: string;
  year: number | string;
  actors: string;
  posterUrl: string;
  timesWatched: number;       
  addedAt: number;  
}
