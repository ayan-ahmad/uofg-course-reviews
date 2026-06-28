import { groupAssessment, GROUPS, ASSESSMENT_COLORS } from "@/lib/assessment";
import type { AssessmentGroup, AssessmentRow } from "@/lib/assessment";

function slicePath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  const rad = (d: number) => ((d - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad(startDeg));
  const y1 = cy + r * Math.sin(rad(startDeg));
  const x2 = cx + r * Math.cos(rad(endDeg));
  const y2 = cy + r * Math.sin(rad(endDeg));
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
}

function Pie({
  segs,
  size,
}: {
  segs: { color: string; pct: number }[];
  size: number;
}) {
  const cx = size / 2,
    cy = size / 2,
    r = size / 2 - 1;
  const active = segs.filter((s) => s.pct > 0.01);
  if (active.length === 0) return null;

  if (active.length === 1) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill={active[0].color} />
      </svg>
    );
  }

  const paths: React.ReactNode[] = [];
  let start = 0;
  for (const seg of active) {
    const sweep = (seg.pct / 100) * 360;
    paths.push(
      <path
        key={`${seg.color}-${start}`}
        d={slicePath(cx, cy, r, start, start + sweep)}
        fill={seg.color}
        stroke="var(--color-surface)"
        strokeWidth="1"
      />,
    );
    start += sweep;
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {paths}
    </svg>
  );
}

export function CoursePie({
  rows,
  size = 28,
}: {
  rows: AssessmentRow[];
  size?: number;
}) {
  const groups = groupAssessment(rows);
  const segs = GROUPS.map((g) => ({
    color: ASSESSMENT_COLORS[g],
    pct: groups[g],
  }));
  return <Pie segs={segs} size={size} />;
}

export function FilterPie({
  filter,
  size = 64,
}: {
  filter: Record<AssessmentGroup, { min: number; max: number }>;
  size?: number;
}) {
  const totalMin = GROUPS.reduce((sum, g) => sum + filter[g].min, 0);

  let segs: { color: string; pct: number }[];
  if (totalMin > 100) {
    const factor = 100 / totalMin;
    segs = GROUPS.map((g) => ({
      color: ASSESSMENT_COLORS[g],
      pct: filter[g].min * factor,
    }));
  } else {
    segs = [
      ...GROUPS.map((g) => ({
        color: ASSESSMENT_COLORS[g],
        pct: filter[g].min,
      })),
      { color: "var(--color-border)", pct: 100 - totalMin },
    ];
  }

  return <Pie segs={segs} size={size} />;
}
