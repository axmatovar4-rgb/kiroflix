export interface CastMember {
  name: string;
  character?: string;
  photo?: string;
}

export interface Movie {
  _id: string;
  title: string;
  description: string;
  genre: string[];
  releaseYear: number;
  duration: number;
  rating: number;
  thumbnail: string;
  backdrop?: string;
  backdropImage?: string;
  videoUrl?: string;
  trailerUrl?: string;
  cast: (string | CastMember)[];
  isFeatured: boolean;
  isTrending?: boolean;
  isNewRelease?: boolean;
  views: number;
  language: string;
  director?: string;
  maturityRating?: string;
  price?: number;        // narx (so'm)
  isFree?: boolean;      // bepulmi
  downloadUrl?: string;  // yuklab olish linki
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  subscription: 'free' | 'basic' | 'standard' | 'premium';
  watchlist: string[];
  watchHistory?: { movieId: string; progress: number; watchedAt: string }[];
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
