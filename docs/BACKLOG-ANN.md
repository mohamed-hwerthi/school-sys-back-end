# Backlog — Section Annuelle (ANN)

Section de gestion de fin d'année scolaire : passages, redoublants, statistiques,
clôture d'année et documents de fin d'année.

**Légende**
- Priorité : `P0` = MVP indispensable · `P1` = important · `P2` = amélioration
- Estimation : points (1 = XS … 8 = XL)
- Statut : `À faire` · `En cours` · `Fait`

---

## Contexte / existant

Le système dispose déjà d'une base réutilisable :

- **`AnneeScolaire`** — entité avec `active` / `cloturee`, trimestres, vacances, jours fériés.
- **`Passage`** — historique de progression : `decision` (`PASSAGE`, `REDOUBLEMENT`,
  `EXCLUSION`, `TRANSFERT`), ancien/nouveau niveau & classe, `motif`.
- **`PassageService`** — valide les décisions, met à jour `Student` lors d'un `PASSAGE`.
- **Page `AnneeScolaire.tsx`** — création de passages en masse.
- **`StatsReussite.tsx` + `BulletinService`** — moyennes, rangs, certificats d'honneur.

Points d'attention :
- `Student.classe` / `Student.niveau` et `Passage.anneeScolaire` sont des **chaînes de
  texte**, pas des clés étrangères.
- Les bulletins sont calculés **par trimestre** ; il n'existe pas de moyenne annuelle.

---

## EPIC A — Socle de données annuelles

| ID | User story | Prio | Est. | Dépend. | Statut |
|---|---|---|---|---|---|
| ANN-001 | Calculer la **moyenne annuelle** d'un élève (moyenne pondérée des 3 trimestres) — service backend + endpoint | P0 | 5 | — | Fait |
| ANN-002 | Endpoint **moyenne annuelle par classe** (liste élèves + moyennes + rang annuel) | P0 | 3 | ANN-001 | Fait |
| ANN-003 | Remplacer `Passage.anneeScolaire` (String) par une **FK vers `AnneeScolaire`** + migration Flyway | P1 | 3 | — | Fait (FK additive, label conservé) |
| ANN-004 | Historiser le couple niveau/classe de l'élève **par année** (dette technique sur les champs String) | P2 | 8 | ANN-003 | À faire |

## EPIC B — Moteur de passage / redoublement

| ID | User story | Prio | Est. | Dépend. | Statut |
|---|---|---|---|---|---|
| ANN-010 | **Décision proposée automatiquement** (`PASSAGE`/`REDOUBLEMENT`) selon moyenne annuelle vs `Bareme.notePassage` | P0 | 5 | ANN-001 | Fait |
| ANN-011 | Endpoint « proposition de passage » par classe (élève + moyenne + décision proposée) | P0 | 3 | ANN-010 | Fait |
| ANN-012 | UI **« Conseil de classe »** : tableau éditable, validation/correction par classe | P0 | 8 | ANN-011 | Fait |
| ANN-013 | **Génération en lot** des `Passage` à partir des décisions validées | P0 | 5 | ANN-012 | Fait (existant) |
| ANN-014 | Gérer `EXCLUSION` / `TRANSFERT` avec **motif obligatoire** | P1 | 2 | ANN-013 | Fait |
| ANN-015 | Garde-fous : double passage la même année, niveau max | P1 | 3 | ANN-013 | Fait |
| ANN-016 | RBAC : seul le **DIRECTEUR** valide/exécute les passages | P0 | 2 | ANN-012 | Fait |
| ANN-017 | Mettre à jour `Student.classe/niveau` après passage (vérifier/compléter `PassageService`) | P0 | 2 | ANN-013 | Fait (existant) |

## EPIC C — Tableau de bord & statistiques annuelles

| ID | User story | Prio | Est. | Dépend. | Statut |
|---|---|---|---|---|---|
| ANN-020 | Page **« Bilan annuel »** : KPI effectif, taux passage/redoublement/exclusion/transfert | P0 | 5 | ANN-021 | Fait |
| ANN-021 | Endpoint stats annuelles agrégées (par niveau / classe) | P0 | 5 | ANN-013 | Fait |
| ANN-022 | Graphiques : évolution effectifs & taux de réussite par niveau | P1 | 3 | ANN-021 | Fait |
| ANN-023 | **Comparatif inter-années** (3-5 ans) | P2 | 5 | ANN-021 | À faire |
| ANN-024 | **Tableau d'honneur / palmarès** annuel (certificats de `BulletinService`) | P1 | 3 | ANN-001 | Fait |
| ANN-025 | Taux de réussite **par matière** | P2 | 5 | ANN-021 | À faire |

## EPIC D — Clôture d'année

| ID | User story | Prio | Est. | Dépend. | Statut |
|---|---|---|---|---|---|
| ANN-030 | **Assistant de clôture** multi-étapes | P1 | 5 | ANN-013 | Fait |
| ANN-031 | Pré-vérifications : notes saisies, examens complets, passages traités | P1 | 3 | ANN-030 | Fait |
| ANN-032 | **Verrouillage en lecture seule** d'une année `cloturee` | P1 | 5 | ANN-030 | Fait |
| ANN-033 | Création de la **nouvelle année scolaire** + trimestres à la clôture | P1 | 3 | ANN-030 | Fait |
| ANN-034 | Journal / audit de clôture (qui, quand, quoi) | P2 | 2 | ANN-030 | À faire |

## EPIC E — Documents de fin d'année

| ID | User story | Prio | Est. | Dépend. | Statut |
|---|---|---|---|---|---|
| ANN-040 | **Bulletin annuel** PDF (synthèse des 3 trimestres) | P1 | 5 | ANN-001 | Fait (synthèse + impression) |
| ANN-041 | Relevé de notes annuel | P2 | 3 | ANN-040 | À faire |
| ANN-042 | Attestation de réussite / certificat de scolarité | P2 | 3 | ANN-013 | À faire |
| ANN-043 | **PV de conseil de classe** (PDF) | P2 | 3 | ANN-013 | À faire |

## EPIC F — Réinscriptions

| ID | User story | Prio | Est. | Dépend. | Statut |
|---|---|---|---|---|---|
| ANN-050 | Générer les **réinscriptions** des élèves passants dans la nouvelle année | P2 | 5 | ANN-033 | À faire |
| ANN-051 | Suivi réinscrits vs partis | P2 | 3 | ANN-050 | À faire |

## EPIC G — Navigation & accès

| ID | User story | Prio | Est. | Dépend. | Statut |
|---|---|---|---|---|---|
| ANN-060 | Entrée de menu **« Année scolaire »** + sous-menu (Bilan, Conseil de classe, Clôture) | P0 | 2 | — | Fait |
| ANN-061 | Permissions front (`lib/permissions.ts`) pour la section | P0 | 2 | ANN-060 | Fait |

---

## Découpage en sprints

| Sprint | Objectif | Stories | Points |
|---|---|---|---|
| Sprint 1 | MVP « Passages » | ANN-001, 002, 010, 011, 012, 013, 016, 017, 060, 061 | ~37 |
| Sprint 2 | Pilotage & stats | ANN-020, 021, 022, 024, 014, 015, 003 | ~24 |
| Sprint 3 | Clôture & documents | ANN-030, 031, 032, 033, 040 | ~21 |
| Backlog | Améliorations ultérieures | ANN-004, 023, 025, 034, 041, 042, 043, 050, 051 | ~36 |

**Total estimé : ~118 points.**

---

## Critères d'acceptation — stories P0 (MVP)

### ANN-001 — Moyenne annuelle
- [ ] La moyenne annuelle = moyenne pondérée des moyennes des 3 trimestres.
- [ ] Gère les trimestres incomplets (notes manquantes) sans planter.
- [ ] Endpoint REST renvoyant la moyenne pour un élève donné.
- [ ] Réponse au format `ApiResponse<T>`.

### ANN-010 / ANN-011 — Proposition automatique
- [ ] `PASSAGE` proposé si moyenne annuelle ≥ `Bareme.notePassage` (défaut 10/20).
- [ ] `REDOUBLEMENT` proposé sinon.
- [ ] L'endpoint renvoie, par classe : élève, moyenne annuelle, rang, décision proposée.

### ANN-012 / ANN-013 — Conseil de classe
- [ ] Tableau par classe : la décision proposée est pré-remplie, modifiable.
- [ ] Le directeur peut corriger chaque ligne (passage / redoublement / exclusion / transfert).
- [ ] La validation génère les enregistrements `Passage` en une seule opération.
- [ ] Confirmation avant exécution ; opération idempotente (pas de doublon).

### ANN-016 — RBAC
- [ ] Seul le rôle `DIRECTEUR` peut valider et exécuter les passages.
- [ ] Les autres rôles ont un accès en lecture seule ou aucun accès.

### ANN-017 — Mise à jour de l'élève
- [ ] Après un `PASSAGE`, `Student.classe` et `Student.niveau` reflètent la nouvelle affectation.
- [ ] Après un `REDOUBLEMENT`, l'élève reste sur le même niveau.

### ANN-020 — Bilan annuel
- [ ] Page affichant : effectif total, nombre/taux de passages, redoublements,
      exclusions, transferts pour l'année active.
- [ ] Sélecteur d'année scolaire.
