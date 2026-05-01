export type DeezerArtist = {
  id: number;
  name: string;
  picture_medium: string;
  nb_fan: number;
  tracklist: string;
};

export type DeezerTrack = {
  id: number;
  title: string;
  duration: number; // in seconds
  preview: string; // 30 second mp3 preview URL ← bonus!
  artist: DeezerArtist;
  album: {
    id: number;
    title: string;
    cover_medium: string;
  };
};

export type DeezerTrackWithAlbumInfo = DeezerTrack & {
  album: {
    title: string;
    cover_medium: string;
    release_date: string;
  };
};

export type DeezerAlbum = {
  id: number;
  title: string;
  release_date: string;
  cover_medium: string;
  nb_tracks: number;
  fans: number;
  record_type: "album" | "single" | "ep";
  artist: DeezerArtist;
  tracks?: {
    data: DeezerTrack[];
  };
};

export type DeezerSearchResponse = {
  data: DeezerArtist[];
  total: number;
};

export type DeezerTracksResponse = {
  data: DeezerTrack[];
  total: number;
};

export type DeezerAlbumsResponse = {
  data: DeezerAlbum[];
  total: number;
};
