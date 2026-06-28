const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

type Props = {
  rating: number | null;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showValue?: boolean;
};

const sizes = { xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };

export default function StarRating({
  rating,
  max = 5,
  size = 'sm',
  showValue = true,
}: Props) {
  if (rating === null || rating === undefined) {
    return <span className="text-xs text-ink-subtle italic">No reviews yet</span>;
  }

  const filled = Math.round(rating);

  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          className={sizes[size]}
          viewBox="0 0 24 24"
          fill={i < filled ? '#4f46e5' : '#e2e8f0'}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
      {showValue && (
        <span className="ml-1 text-xs text-ink-muted">{rating.toFixed(1)}</span>
      )}
    </span>
  );
}
