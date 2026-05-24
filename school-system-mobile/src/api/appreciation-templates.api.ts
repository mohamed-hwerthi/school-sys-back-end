import api from "./axios";

/** MOB-FUNC-023 — modèle d'appréciation réutilisable. */
export interface AppreciationTemplate {
  id: string;
  libelle: string;
  contenu: string;
  /** "POSITIF" | "NEUTRE" | "NEGATIF" */
  tag: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertAppreciationTemplate {
  libelle: string;
  contenu: string;
  tag: "POSITIF" | "NEUTRE" | "NEGATIF";
}

export const appreciationTemplatesApi = {
  list: (): Promise<AppreciationTemplate[]> =>
    api.get("/teacher/appreciation-templates"),

  create: (body: UpsertAppreciationTemplate): Promise<AppreciationTemplate> =>
    api.post("/teacher/appreciation-templates", body),

  update: (id: string, body: UpsertAppreciationTemplate): Promise<AppreciationTemplate> =>
    api.put(`/teacher/appreciation-templates/${id}`, body),

  delete: (id: string): Promise<void> =>
    api.delete(`/teacher/appreciation-templates/${id}`),
};
