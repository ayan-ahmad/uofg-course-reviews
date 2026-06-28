import { useState } from 'react';
import StarSelector from './StarSelector';

type RatingFields = {
  lecturerRating: number;
  workloadRating: number;
  difficultyRating: number;
  usefulnessRating: number;
  markingFairnessRating: number;
  enjoymentRating: number;
  overallRating: number;
};

const RATING_LABELS: { key: keyof RatingFields; label: string }[] = [
  { key: 'lecturerRating', label: 'Lecturer / Teaching (1 - Bad, 5 - Good)' },
  { key: 'workloadRating', label: 'Workload (1 - Bad, 5 - Good)' },
  { key: 'difficultyRating', label: 'Difficulty (1 - Difficult, 5 - Easy)' },
  { key: 'usefulnessRating', label: 'Usefulness (1 - Not Useful, 5 - Useful)' },
  { key: 'markingFairnessRating', label: 'Marking Fairness (1 - Unfair, 5 - Extremely Fair)' },
  { key: 'enjoymentRating', label: 'Enjoyment (1 - Boring, 5 - Enjoyable)' },
  { key: 'overallRating', label: 'Overall (1 - Bad, 5 - Good)' },
];

const emptyRatings: RatingFields = {
  lecturerRating: 0,
  workloadRating: 0,
  difficultyRating: 0,
  usefulnessRating: 0,
  markingFairnessRating: 0,
  enjoymentRating: 0,
  overallRating: 0,
};

type Props = {
  courseCode: string;
  onSubmitted: () => void;
};

export default function ReviewForm({ courseCode, onSubmitted }: Props) {
  const [ratings, setRatings] = useState<RatingFields>(emptyRatings);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [displayName, setDisplayName] = useState('');

  const setRating = (key: keyof RatingFields, value: number) =>
    setRatings((r) => ({ ...r, [key]: value }));

  const allRated = RATING_LABELS.every(({ key }) => ratings[key] > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRated) {
      setError('Please rate all categories.');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseCode, ...ratings, reviewText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.');
        return;
      }
      setDisplayName(data.displayName);
      setSubmitted(true);
      onSubmitted();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 text-center">
        <div className="mb-2 text-2xl">✓</div>
        <p className="font-semibold text-ink">Review submitted!</p>
        <p className="mt-1 text-sm text-ink-muted">
          You're posting as <span className="font-medium text-accent">{displayName}</span>.
          Your anonymous name is stored only on this device.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-surface p-6">
      <h3 className="text-base font-semibold text-ink">Write a review</h3>
      <p className="mb-5 text-sm font-light text-ink-subtle">By leaving a review you agree to remain respectful and honest. Any hateful comments will be removed.</p>

      <div className="mb-5 flex flex-col gap-4">
        {RATING_LABELS.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <span className="min-w-35 text-sm text-ink-secondary">{label}</span>
            <StarSelector value={ratings[key]} onChange={(v) => setRating(key, v)} />
          </div>
        ))}
      </div>

      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Share your experience (optional, max 2000 characters)…"
        rows={6}
        maxLength={2000}
        className="mb-4 w-full resize-y rounded-md border border-border bg-white px-3 py-2 text-sm text-ink-subtle placeholder:text-ink-subtle focus:border-accent focus:outline-none"
      />

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting || !allRated}
        className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting…' : 'Submit review'}
      </button>

      <p className="mt-3 text-center text-xs text-ink-subtle">
        Reviews are anonymous. A random name will be assigned to your account.
      </p>
    </form>
  );
}
