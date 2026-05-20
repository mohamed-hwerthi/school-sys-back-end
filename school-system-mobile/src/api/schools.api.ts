import api from "./axios";
import type { School } from "@/types/school";

export const schoolsApi = {
  /** Lists all active schools — public endpoint, no authentication required. */
  getSchools: (): Promise<School[]> =>
    api.get("/public/schools"),
};
