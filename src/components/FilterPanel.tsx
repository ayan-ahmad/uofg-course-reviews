import { useState } from "react";
import type { Filters } from "./useFilters";

type Props = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  toggle: (key: "levels" | "offered" | "categories", value: string) => void;
  levelOptions: string[];
  offeredOptions: string[];
  creditOptions: number[];
  categoryOptions: string[];
};

const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(value === star ? 0 : star)}
            aria-label={`Minimum ${star} star${star !== 1 ? 's' : ''}`}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill={active >= star ? '#4f46e5' : '#e2e8f0'}
            >
              <path d={STAR_PATH} />
            </svg>
          </button>
        ))}
      </div>
      <p className="text-xs text-ink-muted">
        {value > 0 ? `${value}+ stars minimum` : 'Any rating'}
      </p>
    </div>
  );
}

export default function FilterPanel({
  filters,
  setFilters,
  toggle,
  levelOptions,
  offeredOptions,
  creditOptions,
  categoryOptions,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <Section label="Search">
        <input
          type="text"
          value={filters.search}
          onChange={(e) =>
            setFilters((f) => ({ ...f, search: e.target.value }))
          }
          placeholder="Code or title…"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm placeholder:text-ink-subtle focus:border-accent focus:outline-none"
        />
      </Section>

      <Section label="Minimum rating">
        <StarPicker
          value={filters.minRating}
          onChange={(v) => setFilters((f) => ({ ...f, minRating: v }))}
        />
      </Section>

      <Section label="Minimum credits">
        <ul className="flex flex-col gap-1.5">
          <li>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-secondary">
              <input
                type="radio"
                name="minCredits"
                checked={filters.minCredits === 0}
                onChange={() => setFilters((f) => ({ ...f, minCredits: 0 }))}
                className="h-4 w-4 accent-accent"
              />
              Any
            </label>
          </li>
          {creditOptions.map((v) => (
            <li key={v}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-secondary">
                <input
                  type="radio"
                  name="minCredits"
                  checked={filters.minCredits === v}
                  onChange={() => setFilters((f) => ({ ...f, minCredits: v }))}
                  className="h-4 w-4 accent-accent"
                />
                {v} credit{v !== 1 ? 's' : ''}
              </label>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Academic level">
        <CheckList
          options={levelOptions}
          selected={filters.levels}
          onToggle={(v) => toggle("levels", v)}
        />
      </Section>

      <Section label="Category">
        <CheckList
          options={categoryOptions}
          selected={filters.categories}
          onToggle={(v) => toggle("categories", v)}
        />
      </Section>

      <Section label="Typically offered">
        <CheckList
          options={offeredOptions}
          selected={filters.offered}
          onToggle={(v) => toggle("offered", v)}
        />
      </Section>
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-ink">{label}</h3>
      {children}
    </div>
  );
}

function CheckList<T extends React.Key>({
  options,
  selected,
  onToggle,
}: {
  options: T[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  if (options.length === 0)
    return <p className="text-xs text-ink-subtle">None available</p>;
  return (
    <ul className="flex flex-col gap-1.5">
      {options.map((opt) => (
        <li key={opt}>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-secondary">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => onToggle(opt)}
              className="h-4 w-4 accent-accent"
            />
            {opt}
          </label>
        </li>
      ))}
    </ul>
  );
}
