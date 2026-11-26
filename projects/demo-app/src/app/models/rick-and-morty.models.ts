
export type ResourceType = 'characters' | 'episodes' | 'locations';

export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';

export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface ApiPaginatedResponse<T> {
  info: ApiInfo;
  results: T[];
}

export interface NamedResourceLink {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: CharacterStatus | string;
  species: string;
  type: string;
  gender: string;
  origin: NamedResourceLink;
  location: NamedResourceLink;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

export type ExplorerItem = Character | Episode | Location;

