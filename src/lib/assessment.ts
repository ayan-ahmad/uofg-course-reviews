export type AssessmentGroup = "Exam" | "Coursework" | "Practical";

export const GROUPS: AssessmentGroup[] = ["Exam", "Coursework", "Practical"];

export const ASSESSMENT_GROUPS: Record<AssessmentGroup, string[]> = {
  Exam: ["Written Exam"],
  Coursework: [
    "Written Assignment, including Essay",
    "Report",
    "Dissertation",
    "Portfolio",
    "Project Output (Other than dissertation)",
    "Oral Assessment & Presentation",
    "Set Exercise",
  ],
  Practical: ["Practical Skills Assessment"],
};

export const ASSESSMENT_COLORS: Record<AssessmentGroup, string> = {
  Exam: "#4f46e5",
  Coursework: "#22c55e",
  Practical: "#f97316",
};

export type AssessmentRow = { method: string; percentage: number };

export function groupAssessment(rows: AssessmentRow[]): Record<AssessmentGroup, number> {
  const result: Record<AssessmentGroup, number> = { Exam: 0, Coursework: 0, Practical: 0 };
  for (const row of rows) {
    for (const group of GROUPS) {
      if (ASSESSMENT_GROUPS[group].includes(row.method)) {
        result[group] += row.percentage;
        break;
      }
    }
  }
  return result;
}
