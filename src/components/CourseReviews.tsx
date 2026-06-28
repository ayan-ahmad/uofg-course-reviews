import { useState, useEffect, useCallback } from 'react';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';

type Review = {
  id: number;
  displayName: string | null;
  lecturerRating: number;
  workloadRating: number;
  difficultyRating: number;
  usefulnessRating: number;
  markingFairnessRating: number;
  enjoymentRating: number;
  overallRating: number;
  reviewText: string | null;
  createdAt: number;
};

type Averages = {
  lecturer: number;
  workload: number;
  difficulty: number;
  usefulness: number;
  markingFairness: number;
  enjoyment: number;
  overall: number;
};

const AVG_LABELS: { key: keyof Averages; label: string }[] = [
  { key: 'lecturer', label: 'Lecturer / Teaching' },
  { key: 'workload', label: 'Workload' },
  { key: 'difficulty', label: 'Difficulty' },
  { key: 'usefulness', label: 'Usefulness' },
  { key: 'markingFairness', label: 'Marking Fairness' },
  { key: 'enjoyment', label: 'Enjoyment' },
  { key: 'overall', label: 'Overall' },
];

function formatDate(unix: number) {
  return new Date(unix * 1000).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function CourseReviews({ courseCode }: { courseCode: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averages, setAverages] = useState<Averages | null>(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [myReviewId, setMyReviewId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/${courseCode}`);
      const data = await res.json();
      setReviews(data.reviews ?? []);
      setAverages(data.averages ?? null);
      setCount(data.count ?? 0);
      setMyReviewId(data.myReviewId ?? null);
    } finally {
      setLoading(false);
    }
  }, [courseCode]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete your review? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await fetch(`/api/review/${id}`, { method: 'DELETE' });
      await fetchReviews();
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmitted = () => {
    setShowForm(false);
    fetchReviews();
  };

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">
            Reviews
            {count > 0 && (
              <span className="ml-2 text-sm font-normal text-ink-muted">({count})</span>
            )}
          </h2>
        </div>
        {!showForm && !myReviewId && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 shrink-0"
          >
            + Write a review
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-8">
          <ReviewForm courseCode={courseCode} onSubmitted={handleSubmitted} />
          <button
            onClick={() => setShowForm(false)}
            className="mt-2 text-sm text-accent underline underline-offset-2"
          >
            Cancel
          </button>
        </div>
      )}

      {loading && (
        <p className="text-sm text-ink-muted">Loading reviews…</p>
      )}

      {!loading && averages && (
        <div className="mb-8 rounded-lg border border-border bg-panel p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase text-ink-muted">
            Average ratings
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {AVG_LABELS.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <span className="text-sm text-ink-secondary">{label}</span>
                <StarRating rating={averages[key]} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && count === 0 && (
        <div className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-ink-muted">
          No reviews yet.
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <span className="font-medium text-accent">
                    {review.displayName ?? 'Anonymous'}
                  </span>
                  <span className="ml-3 text-xs text-ink-subtle">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StarRating rating={review.overallRating} size="sm" />
                  {review.id === myReviewId && (
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={deleting}
                      className="text-xs text-red-500 hover:text-red-700 hover:cursor-pointer disabled:opacity-40"
                      title="Delete your review"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {review.reviewText && (
                <p className="mb-4 text-sm text-ink-secondary leading-relaxed">
                  {review.reviewText}
                </p>
              )}

              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3 border-t border-border pt-3">
                {AVG_LABELS.filter((l) => l.key !== 'overall').map(({ key, label }) => {
                  const ratingMap: Record<string, keyof Review> = {
                    lecturer: 'lecturerRating',
                    workload: 'workloadRating',
                    difficulty: 'difficultyRating',
                    usefulness: 'usefulnessRating',
                    markingFairness: 'markingFairnessRating',
                    enjoyment: 'enjoymentRating',
                  };
                  return (
                    <div key={key} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-ink-muted">{label}</span>
                      <StarRating
                        rating={review[ratingMap[key]] as number}
                        size="xs"
                        showValue={false}
                      />
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
