import type { Room, TimeSlot } from "@/types/room";

export const MOCK_ROOMS: Room[] = [
  { id: 1, nom: "Salle A1", type: "Salle de classe", capacite: 30, etage: 0, equipements: ["Tableau blanc", "Projecteur"], statut: "Disponible" },
  { id: 2, nom: "Salle A2", type: "Salle de classe", capacite: 28, etage: 0, equipements: ["Tableau blanc", "Écran TV"], statut: "Occupée" },
  { id: 3, nom: "Salle B1", type: "Salle de classe", capacite: 32, etage: 1, equipements: ["Tableau blanc", "Projecteur", "Climatisation"], statut: "Disponible" },
  { id: 4, nom: "Salle B2", type: "Salle de classe", capacite: 25, etage: 1, equipements: ["Tableau blanc"], statut: "Disponible" },
  { id: 5, nom: "Labo Sciences", type: "Laboratoire", capacite: 20, etage: 1, equipements: ["Paillasses", "Microscopes", "Évier", "Projecteur"], statut: "Disponible" },
  { id: 6, nom: "Salle Info 1", type: "Salle informatique", capacite: 24, etage: 2, equipements: ["Ordinateurs", "Projecteur", "Imprimante", "Climatisation"], statut: "Occupée" },
  { id: 7, nom: "Salle Info 2", type: "Salle informatique", capacite: 20, etage: 2, equipements: ["Ordinateurs", "Projecteur", "Climatisation"], statut: "Disponible" },
  { id: 8, nom: "Bibliothèque", type: "Bibliothèque", capacite: 40, etage: 0, equipements: ["Rayonnages", "Tables de lecture", "Ordinateurs", "Climatisation"], statut: "Disponible" },
  { id: 9, nom: "Gymnase", type: "Salle de sport", capacite: 60, etage: 0, equipements: ["Tapis", "Paniers", "Filets", "Vestiaires"], statut: "Disponible" },
  { id: 10, nom: "Salle C1", type: "Salle de classe", capacite: 30, etage: 2, equipements: ["Tableau blanc", "Projecteur"], statut: "En maintenance" },
  { id: 11, nom: "Salle Polyvalente", type: "Salle polyvalente", capacite: 80, etage: 0, equipements: ["Scène", "Projecteur", "Sono", "Climatisation"], statut: "Disponible" },
  { id: 12, nom: "Salle C2", type: "Salle de classe", capacite: 28, etage: 2, equipements: ["Tableau blanc", "Projecteur", "Climatisation"], statut: "Occupée" },
];

export const MOCK_TIMESLOTS: TimeSlot[] = [
  // Lundi
  { id: 1, salleId: 1, jour: "Lundi", heureDebut: "08:00", heureFin: "09:00", matiere: "Mathématiques", enseignant: "M. Benali", classe: "3A", niveau: "3ème année" },
  { id: 2, salleId: 1, jour: "Lundi", heureDebut: "09:00", heureFin: "10:00", matiere: "Français", enseignant: "Mme. El Fassi", classe: "3A", niveau: "3ème année" },
  { id: 3, salleId: 2, jour: "Lundi", heureDebut: "08:00", heureFin: "09:00", matiere: "Arabe", enseignant: "M. Idrissi", classe: "5B", niveau: "5ème année" },
  { id: 4, salleId: 2, jour: "Lundi", heureDebut: "09:00", heureFin: "10:00", matiere: "Sciences", enseignant: "Mme. Chakir", classe: "5B", niveau: "5ème année" },
  { id: 5, salleId: 3, jour: "Lundi", heureDebut: "10:00", heureFin: "11:00", matiere: "Histoire-Géo", enseignant: "M. Amrani", classe: "4C", niveau: "4ème année" },
  { id: 6, salleId: 5, jour: "Lundi", heureDebut: "10:00", heureFin: "11:00", matiere: "Sciences", enseignant: "Mme. Chakir", classe: "6A", niveau: "6ème année" },
  { id: 7, salleId: 6, jour: "Lundi", heureDebut: "08:00", heureFin: "09:00", matiere: "Informatique", enseignant: "M. Tazi", classe: "4C", niveau: "4ème année" },
  { id: 8, salleId: 6, jour: "Lundi", heureDebut: "14:00", heureFin: "15:00", matiere: "Informatique", enseignant: "M. Tazi", classe: "5B", niveau: "5ème année" },
  { id: 9, salleId: 9, jour: "Lundi", heureDebut: "11:00", heureFin: "12:00", matiere: "Éducation physique", enseignant: "M. Hajji", classe: "2B", niveau: "2ème année" },
  { id: 10, salleId: 1, jour: "Lundi", heureDebut: "14:00", heureFin: "15:00", matiere: "Éducation islamique", enseignant: "M. Filali", classe: "3A", niveau: "3ème année" },

  // Mardi
  { id: 11, salleId: 1, jour: "Mardi", heureDebut: "08:00", heureFin: "09:00", matiere: "Français", enseignant: "Mme. El Fassi", classe: "3A", niveau: "3ème année" },
  { id: 12, salleId: 2, jour: "Mardi", heureDebut: "08:00", heureFin: "09:00", matiere: "Mathématiques", enseignant: "M. Benali", classe: "5B", niveau: "5ème année" },
  { id: 13, salleId: 3, jour: "Mardi", heureDebut: "09:00", heureFin: "10:00", matiere: "Arabe", enseignant: "M. Idrissi", classe: "4C", niveau: "4ème année" },
  { id: 14, salleId: 5, jour: "Mardi", heureDebut: "10:00", heureFin: "11:00", matiere: "Sciences", enseignant: "Mme. Chakir", classe: "3A", niveau: "3ème année" },
  { id: 15, salleId: 6, jour: "Mardi", heureDebut: "09:00", heureFin: "10:00", matiere: "Informatique", enseignant: "M. Tazi", classe: "6A", niveau: "6ème année" },
  { id: 16, salleId: 9, jour: "Mardi", heureDebut: "14:00", heureFin: "15:00", matiere: "Éducation physique", enseignant: "M. Hajji", classe: "1A", niveau: "1ère année" },
  { id: 17, salleId: 4, jour: "Mardi", heureDebut: "08:00", heureFin: "09:00", matiere: "Arts plastiques", enseignant: "Mme. Ziani", classe: "2B", niveau: "2ème année" },
  { id: 18, salleId: 1, jour: "Mardi", heureDebut: "10:00", heureFin: "11:00", matiere: "Mathématiques", enseignant: "M. Benali", classe: "3A", niveau: "3ème année" },

  // Mercredi
  { id: 19, salleId: 1, jour: "Mercredi", heureDebut: "08:00", heureFin: "09:00", matiere: "Arabe", enseignant: "M. Idrissi", classe: "3A", niveau: "3ème année" },
  { id: 20, salleId: 2, jour: "Mercredi", heureDebut: "08:00", heureFin: "09:00", matiere: "Français", enseignant: "Mme. El Fassi", classe: "5B", niveau: "5ème année" },
  { id: 21, salleId: 3, jour: "Mercredi", heureDebut: "09:00", heureFin: "10:00", matiere: "Mathématiques", enseignant: "M. Benali", classe: "4C", niveau: "4ème année" },
  { id: 22, salleId: 6, jour: "Mercredi", heureDebut: "10:00", heureFin: "11:00", matiere: "Informatique", enseignant: "M. Tazi", classe: "3A", niveau: "3ème année" },
  { id: 23, salleId: 9, jour: "Mercredi", heureDebut: "08:00", heureFin: "09:00", matiere: "Éducation physique", enseignant: "M. Hajji", classe: "5B", niveau: "5ème année" },
  { id: 24, salleId: 8, jour: "Mercredi", heureDebut: "14:00", heureFin: "15:00", matiere: "Français", enseignant: "Mme. El Fassi", classe: "1A", niveau: "1ère année" },

  // Jeudi
  { id: 25, salleId: 1, jour: "Jeudi", heureDebut: "08:00", heureFin: "09:00", matiere: "Sciences", enseignant: "Mme. Chakir", classe: "3A", niveau: "3ème année" },
  { id: 26, salleId: 2, jour: "Jeudi", heureDebut: "09:00", heureFin: "10:00", matiere: "Arabe", enseignant: "M. Idrissi", classe: "5B", niveau: "5ème année" },
  { id: 27, salleId: 3, jour: "Jeudi", heureDebut: "08:00", heureFin: "09:00", matiere: "Français", enseignant: "Mme. El Fassi", classe: "4C", niveau: "4ème année" },
  { id: 28, salleId: 5, jour: "Jeudi", heureDebut: "10:00", heureFin: "11:00", matiere: "Sciences", enseignant: "Mme. Chakir", classe: "2B", niveau: "2ème année" },
  { id: 29, salleId: 6, jour: "Jeudi", heureDebut: "14:00", heureFin: "15:00", matiere: "Informatique", enseignant: "M. Tazi", classe: "1A", niveau: "1ère année" },
  { id: 30, salleId: 9, jour: "Jeudi", heureDebut: "11:00", heureFin: "12:00", matiere: "Éducation physique", enseignant: "M. Hajji", classe: "6A", niveau: "6ème année" },

  // Vendredi
  { id: 31, salleId: 1, jour: "Vendredi", heureDebut: "08:00", heureFin: "09:00", matiere: "Mathématiques", enseignant: "M. Benali", classe: "3A", niveau: "3ème année" },
  { id: 32, salleId: 2, jour: "Vendredi", heureDebut: "08:00", heureFin: "09:00", matiere: "Sciences", enseignant: "Mme. Chakir", classe: "5B", niveau: "5ème année" },
  { id: 33, salleId: 3, jour: "Vendredi", heureDebut: "09:00", heureFin: "10:00", matiere: "Histoire-Géo", enseignant: "M. Amrani", classe: "4C", niveau: "4ème année" },
  { id: 34, salleId: 4, jour: "Vendredi", heureDebut: "10:00", heureFin: "11:00", matiere: "Musique", enseignant: "Mme. Ziani", classe: "1A", niveau: "1ère année" },
  { id: 35, salleId: 6, jour: "Vendredi", heureDebut: "08:00", heureFin: "09:00", matiere: "Informatique", enseignant: "M. Tazi", classe: "2B", niveau: "2ème année" },
  { id: 36, salleId: 11, jour: "Vendredi", heureDebut: "14:00", heureFin: "16:00", matiere: "Arts plastiques", enseignant: "Mme. Ziani", classe: "6A", niveau: "6ème année" },

  // Samedi
  { id: 37, salleId: 1, jour: "Samedi", heureDebut: "08:00", heureFin: "09:00", matiere: "Éducation islamique", enseignant: "M. Filali", classe: "3A", niveau: "3ème année" },
  { id: 38, salleId: 2, jour: "Samedi", heureDebut: "08:00", heureFin: "09:00", matiere: "Mathématiques", enseignant: "M. Benali", classe: "5B", niveau: "5ème année" },
  { id: 39, salleId: 9, jour: "Samedi", heureDebut: "09:00", heureFin: "10:00", matiere: "Éducation physique", enseignant: "M. Hajji", classe: "3A", niveau: "3ème année" },
  { id: 40, salleId: 6, jour: "Samedi", heureDebut: "09:00", heureFin: "10:00", matiere: "Informatique", enseignant: "M. Tazi", classe: "4C", niveau: "4ème année" },
];
