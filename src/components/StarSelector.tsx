import { useState } from 'react';

const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

type Props = {
  value: number;
  onChange: (v: number) => void;
};

export default function StarSelector({ value, onChange }: Props) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill={(hover || value) >= star ? '#946846' : '#d8c8a4'}
          >
            <path d={STAR_PATH} />
          </svg>
        </button>
      ))}
    </div>
  );
}
