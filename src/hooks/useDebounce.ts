import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cleanup on each keystroke
  }, [value, delay]);

  return debounced;
};

/*
Usage example:
import { useDebounce } from "@/hooks/useDebounce";
const debouncedQuery = useDebounce(query, 500);  // wait 500ms after typing stops
const { data } = useDeezerArtist(debouncedQuery);
*/
