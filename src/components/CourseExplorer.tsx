import { useState, useEffect } from "react";
import { useFilters, type CourseRatings } from "./useFilters";
import FilterPanel from "./FilterPanel";
import CourseCard from "./CourseCard";

export type Course = {
  code: string;
  title: string;
  shortTitle: string;
  level: string;
  credits: number;
  description: string;
  typicallyOffered: string;
  categories: string[];
  assessmentMethods: { method: string; percentage: number }[];
};

export default function CourseExplorer({ courses }: { courses: Course[] }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [ratings, setRatings] = useState<CourseRatings>({});
  const [reviewedCourses, setReviewedCourses] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/ratings')
      .then((r) => r.json())
      .then((data) => setRatings(data))
      .catch(() => {});

    fetch('/api/rated')
      .then((r) => r.json())
      .then((data) => setReviewedCourses(data))
      .catch(() => {});
  }, []);

  const {
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
  } = useFilters(courses, ratings, reviewedCourses);

  const filterProps = {
    filters,
    setFilters,
    toggle,
    levelOptions,
    offeredOptions,
    creditOptions,
    categoryOptions,
  };

  return (
    <div className="min-h-screen bg-page text-ink">
      <div className="flex w-full">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-border bg-panel px-5 py-6 md:block">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-xs font-semibold uppercase text-ink-muted">
              Filters
            </h2>
            {activeCount > 0 && (
              <button
                onClick={reset}
                className="text-xs text-accent underline-offset-2 hover:cursor-pointer hover:underline"
              >
                Clear {activeCount}
              </button>
            )}
          </div>
          <FilterPanel {...filterProps} />
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-6 py-6 pb-28 sm:px-8 md:pb-6">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold">
              Course catalogue
            </h1>
            <p className="text-sm text-ink-muted">
              Showing{" "}
              <span className="font-semibold text-ink">
                {filtered.length}
              </span>{" "}
              of {courses.length} courses
            </p>
          </header>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-surface p-12 text-center text-ink-muted">
              No courses match these filters.{" "}
              <button
                onClick={reset}
                className="text-accent underline underline-offset-2 hover:cursor-pointer"
              >
                Clear them
              </button>
              .
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((c) => (
                <CourseCard
                  key={c.code}
                  course={c}
                  rating={ratings[c.code] ?? null}
                  isReviewed={reviewedCourses.includes(c.code)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile floating filter button */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg"
        >
          ☰ Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-white/30 px-1.5 py-0.5 text-xs leading-none">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter overlay */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-panel md:hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-xs font-semibold uppercase text-ink-muted">
              Filters
            </h2>
            <div className="flex items-center gap-4">
              {activeCount > 0 && (
                <button
                  onClick={reset}
                  className="text-xs text-accent underline underline-offset-2"
                >
                  Clear {activeCount}
                </button>
              )}
              <button
                onClick={() => setFilterOpen(false)}
                aria-label="Close filters"
                className="text-lg leading-none text-ink"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="overflow-y-auto px-5 py-6">
            <FilterPanel {...filterProps} />
          </div>

          <div className="border-t border-border p-4">
            <button
              onClick={() => setFilterOpen(false)}
              className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-white"
            >
              Show {filtered.length} courses
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
