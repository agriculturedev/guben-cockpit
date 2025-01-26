import { z } from "zod";
import { TimeRegex } from "@/utilities/constants";

export const Time: z.ZodString = z.string().regex(TimeRegex);