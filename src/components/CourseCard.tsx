import StarRating from "./StarRating";
import type { Course } from "./CourseExplorer";
import { CoursePie } from "./AssessmentPie";

type Props = {
  course: Course;
  rating?: { overall: number; count: number } | null;
  isReviewed: boolean;
};

const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

export default function CourseCard({ course: c, rating, isReviewed }: Props) {
  return (
    <a
      href={`/courses/${c.code}`}
      className={`block rounded-lg border ${isReviewed ? "border-ink" : "border-border"} bg-surface p-5 shadow-sm transition-shadow hover:shadow-md hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-accent">
          {c.code}
        </span>
        <div className="flex items-center gap-2">
          <CoursePie rows={c.assessmentMethods} size={22} />
          <span
            className={`rounded-full border border-border px-2 py-0.5 text-xs text-ink-muted ${
              c.credits === 20 ? "bg-badge" : ""
            }`}
          >
            {c.credits} credits
          </span>
          {isReviewed && (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 text-ink-secondary" >
              <title>Reviewed</title>
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
          )}
        </div>
      </div>
      <h3 className="mb-1 text-base font-semibold leading-snug">{c.title}</h3>
      <p className="mb-2 text-xs text-ink-muted">
        {c.level} · {c.typicallyOffered}
      </p>

      <div className="mb-3 flex items-center gap-2">
        {rating ? (
          <StarRating rating={rating.overall} size="xs" />
        ) : (
          <span className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className="w-3 h-3" viewBox="0 0 24 24" fill="#e2e8f0">
                <path d={STAR_PATH} />
              </svg>
            ))}
          </span>
        )}
        {rating && (
          <span className="text-xs text-ink-subtle">
            ({rating.count} review{rating.count !== 1 ? 's' : ''})
          </span>
        )}
      </div>

      <div className="mb-3 flex flex-wrap gap-1">
        {c.categories.map((cat) => (
          <span
            key={cat}
            className="rounded-full bg-panel px-2 py-0.5 text-xs text-ink-muted"
          >
            {cat}
          </span>
        ))}
      </div>
      <p className="text-sm text-ink-secondary line-clamp-3">{c.description}</p>
    </a>
  );
}
