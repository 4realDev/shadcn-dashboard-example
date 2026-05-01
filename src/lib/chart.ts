import type { DeezerTrackWithAlbumInfo } from "@/api/modules/deezer/deezer.types";

export type ReleaseChartPoint = {
  date: string; // "1992-09"
  count: number; // songs released this month
  titles: string[]; // song names for tooltip
};

// transforms array of tracks into chart-ready data points grouped by release month
export const transformTracksToChartData = (
  tracks: DeezerTrackWithAlbumInfo[],
): ReleaseChartPoint[] => {
  // 1. group tracks by year-month
  //   {
  //     "1992-09": ["Creep"],
  //     "1997-05": ["Paranoid Android"],
  //     "1997-08": ["Karma Police", "No Surprises"],
  //   }
  const grouped = tracks.reduce<Record<string, string[]>>((acc, track) => {
    const date = track.album.release_date; // "1992-09-21"
    if (!date) return acc; // skip tracks with no date — acc unchanged

    const monthKey = date.slice(0, 7); // "1992-09-21" → "1992-09"

    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(track.title);

    return acc;
  }, {});

  // 2. Convert to array and sort chronologically
  // [
  //   { date: "1992-09", count: 1, titles: ["Creep"] },
  //   { date: "1997-05", count: 1, titles: ["Paranoid Android"] },
  //   { date: "1997-08", count: 2, titles: ["Karma Police", "No Surprises"] },
  // ]
  return (
    // Object.entries converts object into array of [key, value] pairs
    Object.entries(grouped)
      // destructures each [key, value] pair
      .map(([date, titles]) => ({
        date,
        count: titles.length,
        titles,
      }))
      // localeCompare works perfectly because date strings are in YYYY-MM string format -> alphabetical order == chronological order
      .sort((a, b) => a.date.localeCompare(b.date))
  );
};
