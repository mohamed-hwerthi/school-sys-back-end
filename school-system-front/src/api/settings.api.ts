import api from "./axios";

export interface SchoolSettingsDTO {
  schoolName: string;
  schoolNameAr: string | null;
  anneeScolaire: string;
  adresse: string | null;
  telephone: string | null;
  directeurName: string | null;
  directeurNameAr: string | null;
}

const BASE = "/settings";

export const settingsApi = {
  get: async (): Promise<SchoolSettingsDTO> => {
    const res = await api.get<SchoolSettingsDTO>(BASE);
    return res.data;
  },

  update: async (dto: SchoolSettingsDTO): Promise<SchoolSettingsDTO> => {
    const res = await api.put<SchoolSettingsDTO>(BASE, dto);
    return res.data;
  },
};
