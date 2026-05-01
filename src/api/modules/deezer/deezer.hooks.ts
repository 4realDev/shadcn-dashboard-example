/*
Rule of thumb: one file per concern - all these hooks are same concern — fetching deezer data
- imports fetch functions from lib/deezer
- uses react-query to manage data fetching, caching, and state management for components
*/
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  getDeezerArtistData,
  getDeezerArtistAlbums,
  getDeezerArtistTopTracks,
  getDeezerAlbumTracks,
} from "./deezer.api";
import type { DeezerTrackWithAlbumInfo } from "./deezer.types";

// ─── query keys ──────────────────────────────────────────────────────────────
// centralised here so hooks never hardcode strings

/*
Without it you write raw strings everywhere:
tsx// scattered across multiple files — easy to make typos
queryKey: ["deezer", "albums", artistId]
queryClient.invalidateQueries(["deezer", "ablums", artistId]) // typo! silent bug
With deezerKeys there's one source of truth:
tsxqueryKey: deezerKeys.albums(artistId)
queryClient.invalidateQueries({ queryKey: deezerKeys.albums(artistId) }) // always correc
*/

// CURRENTLY UNUSED, but good to have for consistency and to avoid hardcoding strings in multiple places.
// Also makes it easier to change the structure of query keys in the future if needed.
/*
export const deezerKeys = {
  all: ["deezer"] as const,
  artists: () => [...deezerKeys.all, "artists"] as const,
  artist: (query: string) => [...deezerKeys.artists(), query] as const,
  albums: (artistId: number) =>
    [...deezerKeys.all, "albums", artistId] as const,
  albumTracks: (albumId: number) =>
    [...deezerKeys.all, "tracks", albumId] as const,
  topTracks: (artistId: number) =>
    [...deezerKeys.all, "top-tracks", artistId] as const,
};
*/

export const useDeezerArtist = (query: string) => {
  return useQuery({
    queryKey: ["deezer", "artist", query],
    queryFn: () => getDeezerArtistData(query),
    enabled: !!query,
    staleTime: 1000 * 60 * 10,
  });
};

export const useDeezerArtistAlbums = (artistId: number | null) => {
  return useQuery({
    queryKey: ["deezer", "artist", artistId, "albums"],
    queryFn: () => getDeezerArtistAlbums(artistId!),
    enabled: !!artistId,
    staleTime: 1000 * 60 * 10,
  });
};

export const useDeezerArtistTopTracks = (artistId: number | null) => {
  return useQuery({
    queryKey: ["deezer", "artist", artistId, "top-tracks"],
    queryFn: () => getDeezerArtistTopTracks(artistId!),
    enabled: !!artistId,
    staleTime: 1000 * 60 * 10,
  });
};

export const useDeezerAlbumTracks = (albumId: number | null) => {
  return useQuery({
    queryKey: ["deezer", "album", albumId, "tracks"],
    queryFn: () => getDeezerAlbumTracks(albumId!),
    enabled: !!albumId,
    staleTime: 1000 * 60 * 10,
  });
};

export const useDeezerAllTracks = (artistId: number | null) => {
  // 1. Get all artist albums
  const { data: albumsData, isLoading: isLoadingAlbums } = useDeezerArtistAlbums(artistId);
  console.log("Albums data:", albumsData);

  // 2. For each album fire one query (in parallel)
  // useQueries is equal to Promises.all - parallel fetching
  // + each query is cached individually, has its own isLoading, isError state, will be retried automatically if failed
  const albumTrackQueries = useQueries({
    // albumsData?.data is undefined, until useDeezerArtistAlbums is finished
    // fallback to [] to avoid "cannot map over undefined" error
    queries: (albumsData?.data ?? []).map((album) => ({
      queryKey: ["deezer", "artist", artistId, "albums", album.id, "tracks"],
      queryFn: () => getDeezerAlbumTracks(album.id),
      staleTime: 1000 * 60 * 10,
    })),
  });

  // 3. Flatten all track from all albums into one array
  // with map — nested arrays, hard to work with
  // [[track1, track2], [track3, track4], [track5, track6]]

  // flatMap — one flat list of all tracks
  // [track1, track2, track3, track4, track5, track6]
  const allTracks = albumTrackQueries.flatMap((query, index) => {
    const album = albumsData?.data[index];
    return (query.data?.data ?? []).map(
      (track) =>
        ({
          ...track,
          // add album info for chart
          album: {
            title: album?.title ?? "Unknown Album",
            cover_medium: album?.cover_medium ?? "",
            release_date: album?.release_date ?? "",
          },
        }) as DeezerTrackWithAlbumInfo,
    );
  });

  const isLoadingTracks = albumTrackQueries.some((query) => query.isLoading);
  const isErrorTracks = albumTrackQueries.some((query) => query.isError);

  // 4. For progress indicator -> how many albums have succeeded in loading so far
  const loadedCount = albumTrackQueries.filter((query) => query.isSuccess).length;
  const totalCount = albumTrackQueries.length ?? 0;

  return {
    tracks: allTracks,
    isLoading: isLoadingAlbums || isLoadingTracks,
    isError: isErrorTracks,
    progress: { loaded: loadedCount, total: totalCount },
  };
};
