import { z } from "zod"

export const AddGameFormSchema = z.object({
    title: z.string().min(2).max(50),
    openTime: z.string().min(5).max(10),
    closeTime: z.string().min(5).max(10),
    daysCount: z.string().min(1).max(1),
    slug: z.string().min(1).max(100).optional()
})

const DATE_REQUIRED_ERROR = "Date is required.";

export const AddRecordFormSchema = z.object({
    leftPanel: z.string().min(3).max(3),
    rightPanel: z.string().min(3).max(3),
    pair: z.string().min(2).max(2),
    date: z.date({ required_error: DATE_REQUIRED_ERROR }).refine(date => !!date, DATE_REQUIRED_ERROR),
    // date: z.string(),
})

export const EditRecordFormSchema = z.object({
    leftPanel: z.string().min(3).max(3),
    rightPanel: z.string().min(3).max(3),
    pair: z.string().min(2).max(2),
    date: z.string(),
})

export type RecordInput = z.infer<typeof AddRecordFormSchema>


// gameId: z.string().min(2).max(50),
// lefPanel: z.string().min(5).max(10),
// pair: z.string().min(5).max(10),
// rightPanel: z.string().min(1).max(50),
// date: z.date({ required_error: DATE_REQUIRED_ERROR }).nullable().refine(date => !!date, DATE_REQUIRED_ERROR),