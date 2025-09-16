import { useEffect } from "react";

/**
 * Custom hook för att ändra sidans titel.
 * Använd: useTitle("Min titel")
 */
export const useTitle = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};