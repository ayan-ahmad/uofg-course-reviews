import { useState, useEffect, useMemo } from "react";
import type { Course } from "./CourseExplorer";

export type Filters = {
  search: string;
  levels: string[];
  offered: string[];
  categories: string[];
  minCredits: number;
  minRating: number;
};

const STORAGE_KEY = "course-explorer-filters";

export const emptyFilters: Filters = {
  search: "",
  levels: [],
  offered: [],
  categories: [],
  minCredits: 0,
  minRating: 0,
};

export type CourseRatings = Record<string, { overall: number; count: number }>;

export function useFilters(courses: Course[], ratings: CourseRatings = {}) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setFilters({ ...emptyFilters, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {}
  }, [filters, hydrated]);

  const levelOptions = useMemo(
    () => [...new Set(courses.map((c) => c.level))].sort(),
    [courses],
  );
  const offeredOptions = useMemo(
    () => [...new Set(courses.map((c) => c.typicallyOffered))].sort(),
    [courses],
  );
  const creditOptions = useMemo(
    () => [...new Set(courses.map((c) => c.credits))].sort(),
    [courses],
  );
  const categoryOptions = useMemo(
    () => [...new Set(courses.flatMap((c) => c.categories))].sort(),
    [courses],
  );

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return courses.filter((c) => {
      if (
        q &&
        !`${c.code} ${c.title} ${c.shortTitle}`.toLowerCase().includes(q)
      )
        return false;
      if (filters.levels.length && !filters.levels.includes(c.level))
        return false;
      if (
        filters.offered.length &&
        !filters.offered.includes(c.typicallyOffered)
      )
        return false;
      if (
        filters.categories.length &&
        !filters.categories.some((cat) => c.categories.includes(cat))
      )
        return false;
      if (c.credits < filters.minCredits) return false;
      if (filters.minRating > 0) {
        const r = ratings[c.code];
        if (!r || r.overall < filters.minRating) return false;
      }
      return true;
    });
  }, [courses, filters, ratings]);

  const toggle = (key: "levels" | "offered" | "categories", value: string) =>
    setFilters((f) => {
      const set = new Set(f[key]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...f, [key]: [...set] };
    });

  const activeCount =
    filters.levels.length +
    filters.offered.length +
    filters.categories.length +
    (filters.minCredits > 0 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.search ? 1 : 0);

  const reset = () => setFilters(emptyFilters);

  return {
    filters,
    setFilters,
    filtered,
    toggle,
    activeCount,
    reset,
    levelOptions,
    offeredOptions,
    creditOptions,
    categoryOptions,
  };
}
