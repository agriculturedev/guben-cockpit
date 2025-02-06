import type * as Schemas from "@/endpoints/auroraSchemas";

export type ApiErrorResult = {
  status: number;
  payload: Schemas.ProblemDetails;
}