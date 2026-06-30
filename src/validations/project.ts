import { z } from "zod"
import { MAX_TAG_LENGTH, MAX_TAGS, MAX_TAGS_MESSAGE } from "@/constants/tags"

export const projectStatusSchema = z.enum([
  "PLANNING",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "ARCHIVED",
])

export const projectPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"])

export const createProjectSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(120, "Name must be at most 120 characters"),
    description: z
      .string()
      .max(500, "Description must be at most 500 characters")
      .optional(),
    color: z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/, "Invalid color")
      .optional()
      .default("#3b82f6"),
    tags: z
      .array(z.string().min(1).max(MAX_TAG_LENGTH))
      .max(MAX_TAGS, MAX_TAGS_MESSAGE)
      .optional()
      .default([]),
    status: projectStatusSchema.optional().default("ACTIVE"),
    priority: projectPrioritySchema.nullable().optional(),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
      .nullable()
      .optional(),
    targetDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
      .nullable()
      .optional(),
    icon: z.string().max(50).nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.targetDate) {
        return data.targetDate >= data.startDate
      }
      return true
    },
    { message: "Target date must be on or after start date", path: ["targetDate"] }
  )

export const updateProjectSchema = createProjectSchema
  .innerType()
  .partial()
  .extend({
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
      .nullable()
      .optional(),
    targetDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
      .nullable()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  })
  .refine(
    (data) => {
      if (data.startDate && data.targetDate) {
        return data.targetDate >= data.startDate
      }
      return true
    },
    { message: "Target date must be on or after start date", path: ["targetDate"] }
  )

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>

export type ProjectStatus = z.infer<typeof projectStatusSchema>
export type ProjectPriority = z.infer<typeof projectPrioritySchema>

// Form schema (client-side) — text fields managed by react-hook-form
export const projectFormSchema = z.object({
  name: z.string().min(1, "Project name is required").max(120),
  description: z.string().max(500).optional(),
  icon: z.string().max(50).optional(),
})

export type ProjectFormValues = z.infer<typeof projectFormSchema>
