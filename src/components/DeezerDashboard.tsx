// import { useState } from "react";
// import { useDeezerArtist } from "@/hooks/useDeezerArtist";
// import { useDeezerArtistTopTracks } from "@/hooks/useDeezerArtistTopTracks";
// import { useDeezerArtistAlbums } from "@/hooks/useDeezerArtistAlbums";
// import { useDeezerAlbumTracks } from "@/hooks/useDeezerAlbumTracks";

// /*
// Data structure you get
// artist
// ├── topTracks[]          ← direct from /artist/{id}/top
// └── albums[]
//     ├── album 1
//     │   └── tracks[]     ← loaded on click from /album/{id}/tracks
//     ├── album 2
//     │   └── tracks[]
//     └── ...
// - album tracks are loaded lazily on click
// - react query caches each album separately - clicking same album twice doesn't refetch
// - this is important because if an artist has 20 albums you don't want to fire 20 requests upfront

// To get all tracks you need to go through albums since Deezer doesn't have a single "all tracks" endpoint:
// artist → albums[] → for each album → tracks[]
// */

// export const DeezerDashboard = () => {
//   // If query is used directly in hook, react fires API request on every single keystroke
//   // With two different states the search only fires API request when user submits form
//   // -> much cleaner and avoids hammering API
//   const [query, setQuery] = useState(""); // what the user is typing
//   const [search, setSearch] = useState(""); // what actually triggers the API call
//   const [artistId, setArtistId] = useState<number | null>(null);
//   const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);

//   const { data: searchData } = useDeezerArtist(search);
//   const { data: topTracks } = useDeezerArtistTopTracks(artistId);
//   const { data: albumsData } = useDeezerArtistAlbums(artistId);
//   const { data: albumTracks } = useDeezerAlbumTracks(selectedAlbum);

//   const artist = searchData?.data[0];

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     setArtistId(null); // reset previous artist
//     setSelectedAlbum(null);
//     setSearch(query); // trigger query
//   };

//   return (
//     <div>
//       {/* ── search ────────────────────────────────── */}
//       <form onSubmit={handleSearch}>
//         <input
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search artist..."
//         />
//         <button type="submit">Search</button>
//       </form>

//       {/* ── artist picker ─────────────────────────── */}
//       {!artistId &&
//         searchData?.data.map((a) => (
//           <div
//             key={a.id}
//             onClick={() => setArtistId(a.id)}>
//             <img
//               src={a.picture_medium}
//               alt={a.name}
//               width={48}
//             />
//             <span>{a.name}</span>
//             <span>{a.nb_fan.toLocaleString()} fans</span>
//           </div>
//         ))}

//       {artistId && (
//         <>
//           {/* ── top tracks ──────────────────────────── */}
//           <section>
//             <h2>Top Tracks</h2>
//             {topTracks?.data.map((track) => (
//               <div key={track.id}>
//                 <img
//                   src={track.album.cover_medium}
//                   alt={track.album.title}
//                   width={48}
//                 />
//                 <span>{track.title}</span>
//                 <span>
//                   {Math.floor(track.duration / 60)}:
//                   {String(track.duration % 60).padStart(2, "0")}
//                 </span>
//                 <audio
//                   controls
//                   src={track.preview}
//                 />
//               </div>
//             ))}
//           </section>

//           {/* ── albums ──────────────────────────────── */}
//           <section>
//             <h2>Albums</h2>
//             {albumsData?.data.map((album) => (
//               <div
//                 key={album.id}
//                 onClick={() =>
//                   setSelectedAlbum(
//                     selectedAlbum === album.id ? null : album.id, // toggle
//                   )
//                 }>
//                 <img
//                   src={album.cover_medium}
//                   alt={album.title}
//                   width={64}
//                 />
//                 <div>{album.title}</div>
//                 <div>{album.release_date}</div>
//                 <div>{album.nb_tracks} tracks</div>

//                 {/* ── album tracks (expand on click) ── */}
//                 {selectedAlbum === album.id && (
//                   <ul>
//                     {albumTracks?.data.map((track) => (
//                       <li key={track.id}>
//                         <span>{track.title}</span>
//                         <span>
//                           {Math.floor(track.duration / 60)}:
//                           {String(track.duration % 60).padStart(2, "0")}
//                         </span>
//                         <audio
//                           controls
//                           src={track.preview}
//                         />
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             ))}
//           </section>
//         </>
//       )}
//     </div>
//   );
// };

import { useState } from "react";
import { ChartReleaseTimeline } from "./ChartReleaseDate";
import { useDeezerArtist, useDeezerAllTracks } from "@/api/modules/deezer/deezer.hooks";

export const DeezerDashboard = () => {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  // 1. search for artist by name
  const { data: searchData } = useDeezerArtist(search);

  // derived artistId from searchData array directly — always in sync, no extra state, no useEffect anti-pattern
  const artistId = searchData?.data[0]?.id ?? null;

  // 2. fetch all tracks, once artistId is set (user enters artist name )
  const { tracks, isLoading, progress } = useDeezerAllTracks(artistId);

  console.log("All tracks:", tracks);

  const handleSearch = (e: React.FormEvent) => {
    console.log("Search submitted:", query);
    e.preventDefault();
    setSearch(query);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10">
      {/* ── header ──────────────────────────────────────── */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-1">Music Explorer</h1>
        <p className="text-zinc-500 text-sm">
          Search any artist to explore their tracks and albums
        </p>
      </div>
      {/* ── search ──────────────────────────────────────── */}
      <form
        onSubmit={handleSearch}
        className="flex gap-2 mb-8 max-w-xl">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for an artist..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5
                     text-sm text-zinc-100 placeholder:text-zinc-600
                     focus:outline-none focus:ring-2 focus:ring-zinc-600
                     transition-all"
        />
        <button
          type="submit"
          disabled={!query}
          className="px-5 py-2.5 bg-white text-zinc-950 text-sm font-semibold
                     rounded-xl hover:bg-zinc-200 disabled:opacity-30
                     disabled:cursor-not-allowed transition-all">
          Search
        </button>
      </form>
      {/* chart — only shows when tracks are loaded */}
      {/* show progress while loading */}
      {isLoading && (
        <div>
          Loading tracks... {progress.loaded} / {progress.total} albums
        </div>
      )}
      {!isLoading && tracks.length > 0 && <ChartReleaseTimeline tracks={tracks} />}
    </div>
  );
};

//       {/* ── loading ─────────────────────────────────────── */}
//       {isSearching && <p className="text-zinc-500 text-sm animate-pulse">Searching...</p>}

//       {/* ── artist results ──────────────────────────────── */}
//       {!artistId && searchData?.data.length > 0 && (
//         <div className="flex flex-col gap-2 max-w-xl mb-8">
//           {searchData.data.map((a) => (
//             <button
//               key={a.id}
//               onClick={() => handleArtistSelect(a.id)}
//               className="flex items-center gap-4 p-3 bg-zinc-900 border border-zinc-800
//                          rounded-xl hover:border-zinc-600 hover:bg-zinc-800
//                          transition-all text-left group">
//               <img
//                 src={a.picture_medium}
//                 alt={a.name}
//                 width={48}
//                 height={48}
//                 className="rounded-lg object-cover"
//               />
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-semibold text-white truncate">{a.name}</p>
//                 <p className="text-xs text-zinc-500">{a.nb_fan.toLocaleString()} fans</p>
//               </div>
//               <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors text-xs">
//                 Select →
//               </span>
//             </button>
//           ))}
//         </div>
//       )}

//       {/* ── artist dashboard ────────────────────────────── */}
//       {artistId && (
//         <div className="space-y-10">
//           {/* ── top tracks ────────────────────────────────── */}
//           <section>
//             <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
//               Top Tracks
//             </h2>
//             {isLoadingTracks && (
//               <p className="text-zinc-600 text-sm animate-pulse">Loading tracks...</p>
//             )}
//             <div className="flex flex-col gap-1">
//               {topTracks?.data.map((track, index) => (
//                 <div
//                   key={track.id}
//                   className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-900
//                              transition-all group">
//                   {/* index */}
//                   <span className="text-zinc-600 text-xs w-4 text-right shrink-0">{index + 1}</span>
//                   {/* cover */}
//                   <img
//                     src={track.album.cover_medium}
//                     alt={track.album.title}
//                     width={40}
//                     height={40}
//                     className="rounded-lg object-cover shrink-0"
//                   />
//                   {/* title + album */}
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium text-white truncate">{track.title}</p>
//                     <p className="text-xs text-zinc-500 truncate">{track.album.title}</p>
//                   </div>
//                   {/* duration */}
//                   <span className="text-xs text-zinc-600 shrink-0">
//                     {formatDuration(track.duration)}
//                   </span>
//                   {/* preview */}
//                   <audio
//                     controls
//                     src={track.preview}
//                     className="h-7 w-32 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
//                   />
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* ── albums ────────────────────────────────────── */}
//           <section>
//             <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
//               Albums
//             </h2>
//             {isLoadingAlbums && (
//               <p className="text-zinc-600 text-sm animate-pulse">Loading albums...</p>
//             )}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//               {albumsData?.data.map((album) => (
//                 <div
//                   key={album.id}
//                   className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
//                   {/* album header — click to expand */}
//                   <button
//                     onClick={() => handleAlbumToggle(album.id)}
//                     className="w-full text-left group">
//                     <div className="relative">
//                       <img
//                         src={album.cover_medium}
//                         alt={album.title}
//                         className="w-full aspect-square object-cover"
//                       />
//                       {/* overlay on hover */}
//                       <div
//                         className="absolute inset-0 bg-black/40 opacity-0
//                                       group-hover:opacity-100 transition-opacity
//                                       flex items-center justify-center">
//                         <span className="text-white text-xs font-medium">
//                           {selectedAlbum === album.id ? "Collapse" : "View tracks"}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="p-3">
//                       <p className="text-sm font-semibold text-white truncate">{album.title}</p>
//                       <p className="text-xs text-zinc-500 mt-0.5">
//                         {album.release_date} · {album.nb_tracks} tracks
//                       </p>
//                     </div>
//                   </button>

//                   {/* ── album tracks (expand on click) ──── */}
//                   {selectedAlbum === album.id && (
//                     <div className="border-t border-zinc-800 px-3 pb-3">
//                       {isLoadingAlbumTracks && (
//                         <p className="text-zinc-600 text-xs py-3 animate-pulse">
//                           Loading tracks...
//                         </p>
//                       )}
//                       <ul className="mt-2 space-y-1">
//                         {albumTracks?.data.map((track, index) => (
//                           <li
//                             key={track.id}
//                             className="flex items-center gap-2 py-1.5 group/track">
//                             <span className="text-zinc-700 text-xs w-4 text-right shrink-0">
//                               {index + 1}
//                             </span>
//                             <span className="flex-1 text-xs text-zinc-300 truncate">
//                               {track.title}
//                             </span>
//                             <span className="text-xs text-zinc-600 shrink-0">
//                               {formatDuration(track.duration)}
//                             </span>
//                             <audio
//                               controls
//                               src={track.preview}
//                               className="h-6 w-20 shrink-0 opacity-0
//                                          group-hover/track:opacity-100 transition-opacity"
//                             />
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//       )}
//     </div>
//   );
// };
