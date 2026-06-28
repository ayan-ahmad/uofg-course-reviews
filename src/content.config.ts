import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const field = <T extends z.ZodTypeAny>(value: T) =>
  z.object({
    label: z.string(),
    value,
  });

export const courses = defineCollection({
  loader: glob({ base: "./src/content/courses", pattern: "*.json" }),
  schema: z.object({
    course_code: field(z.string()),
    course_title: field(z.string()),
    academic_level: field(z.string()),
    credits: field(z.number()),
    short_description_of_the_course: field(z.string()),
    requirements_of_entry: field(z.array(z.string().nullable())),
    co_requisites: field(z.string().nullable()),
    excluded_courses: field(z.string().nullable()),
    typically_offered: field(z.string()),
    timetable_and_length_and_frequency_of_teaching_sessions: field(z.string()),
    course_aims: field(z.string()),
    intended_learning_outcomes_of_course: field(z.string()),

    learning_and_teaching_methods: field(
      z.object({
        rows: z.array(
          z.object({
            method: z.string(),
            formal_contact_hours: z.number().nullable(),
            notional_learning_hours: z.number(),
          }),
        ),
        total: z.object({
          formal_contact_hours: z.number(),
          notional_learning_hours: z.number(),
        }),
      }),
    ),

    summative_assessment_methods: field(
      z.object({
        rows: z.array(
          z.object({
            method: z.string(),
            percentage: z.number(),
          }),
        ),
        total_percentage: z.number(),
      }),
    ),

    description_of_summative_assessment: field(z.string()),

    formative_assessment_feedback: field(z.string().nullable()),
    examination_diet: field(z.string().nullable()),
    total_exam_duration: field(z.string()),
    short_title: field(z.string()),
    categories: field(z.array(z.string())),

    additional_relevant_information: field(z.string().nullable()),
  }),
});

export const collections = { courses };
