import { DEEZER_API_URL } from "@/constants";
import type {
  DeezerAlbum,
  DeezerAlbumsResponse,
  DeezerSearchResponse,
  DeezerTracksResponse,
} from "./deezer.types";
import { createHttpClient } from "@/api/config/fetch";

// CORS proxy for solving CORS errors
// https://proxy.corsfix.com
// Note: In production, you should set up your own CORS proxy or use server-side code to avoid exposing your API key and to ensure reliability.

/*
Available endpoints
/artist/{id}/top        → top tracks
/artist/{id}/albums     → all albums
/album/{id}/tracks      → tracks from a specific album
*/

// generic fetch helper
// const deezerFetch = async <T>(endpoint: string): Promise<T> => {
//   const response = await fetch(`${DEEZER_API_URL}${endpoint}`);

//   if (!response.ok) {
//     throw new Error(`Deezer API error: ${response.status}`);
//   }

//   return response.json();
// };

const deezerClient = createHttpClient(DEEZER_API_URL);

export const getDeezerArtistData = async (query: string) => {
  return deezerClient<DeezerSearchResponse>(`/search/artist?q=${encodeURIComponent(query)}`);
};

export const getDeezerArtistTopTracks = async (artistId: number) => {
  return deezerClient<DeezerTracksResponse>(`/artist/${artistId}/top?limit=10`);
};

export const getDeezerArtistAlbums = async (artistId: number) => {
  return deezerClient<DeezerAlbumsResponse>(`/artist/${artistId}/albums`);
};

export const getDeezerAlbumTracks = async (albumId: number) => {
  return deezerClient<DeezerTracksResponse>(`/album/${albumId}/tracks`);
};

export const getDeezerAlbum = async (albumId: number) => {
  return deezerClient<DeezerAlbum>(`/album/${albumId}`);
};
