# Script de démo — Pitch commercial (écoles)

> **Durée cible : 12 min de démo live.** Suit une "journée type" autour d'un élève, à travers 4 rôles.
> **Avant de commencer :** mots de passe des 5 comptes réinitialisés à une valeur simple commune, données seedées vérifiées, onglets pré-ouverts.

## Comptes de démo (tenant `demo-school`)

| Ordre | Rôle | Email | Mot de passe |
|-------|------|-------|--------------|
| 1 | Directeur | `directeur@school.dev` | _(à définir, ex. `Demo1234!`)_ |
| 2 | Enseignant | `prof@school.dev` | _(idem)_ |
| 3 | Comptable | `comptable@school.dev` | _(idem)_ |
| 4 | Parent | `parent@school.dev` | _(idem)_ |
| — | Super Admin (optionnel) | `admin@school.dev` | _(idem)_ |

**Astuce :** ouvre chaque rôle dans une **fenêtre de navigation privée séparée** (ou 4 profils navigateur) pour basculer instantanément sans te reconnecter en direct.

---

## Phrase d'accroche (avant la démo)

> « Aujourd'hui, dans votre école, une note ça passe par : le prof l'écrit sur papier → la secrétaire la ressaisit → le bulletin est imprimé → le parent la découvre 3 mois plus tard. Je vais vous montrer la même chose en 30 secondes, et le parent prévenu en temps réel. »

---

## 1. DIRECTEUR — « Le pilotage » (≈3 min)

**Connexion :** `directeur@school.dev` → arrive sur `/dashboard`

| Étape | Action | Phrase à dire |
|-------|--------|---------------|
| 1.1 | Montrer le **dashboard** (`/dashboard`) | « Dès la connexion, vous voyez votre école en un écran : effectifs, présences du jour, recettes du mois. » |
| 1.2 | Aller dans **Inscriptions** (`/dashboard/inscriptions`) | « Une nouvelle inscription, c'est ici — le dossier complet, plus de classeurs papier. » |
| 1.3 | Aller dans **Statistiques** (`/dashboard/statistique`) | « Et pour le conseil d'administration : taux de réussite, comparatifs par niveau, en un clic. » |

**Message clé :** *« Vous arrêtez de piloter à l'aveugle. »*

---

## 2. ENSEIGNANT — « Le quotidien terrain » (≈3 min)

**Connexion :** `prof@school.dev` (Fatma Enseignante)

| Étape | Action | Phrase à dire |
|-------|--------|---------------|
| 2.1 | **Faire l'appel** (`/dashboard/absences/appel`) | « Le matin, le prof fait l'appel sur sa tablette en 20 secondes. Le parent de l'absent est notifié automatiquement. » |
| 2.2 | **Saisir des notes** (`/dashboard/carnets`) | « Les notes du contrôle : il les saisit ici, directement. Plus de double saisie par la secrétaire. » |
| 2.3 | **Appréciation de bulletin** (fonction IA dans le carnet/bulletin) | « Et pour les appréciations, l'IA propose un texte que le prof ajuste — gain de temps énorme en fin de trimestre. » |

**Message clé :** *« 5 minutes au lieu d'une heure de paperasse, chaque jour. »*

---

## 3. COMPTABLE — « L'argent » (≈3 min)

**Connexion :** `comptable@school.dev` (Ali Comptable)

| Étape | Action | Phrase à dire |
|-------|--------|---------------|
| 3.1 | **Encaisser un paiement** (`/dashboard/finance/paiement`) | « Un parent paie une tranche : encaissement + reçu généré instantanément. » |
| 3.2 | **Relances impayés** (`/dashboard/finance/relances`) | « Le système connaît tout seul qui n'a pas payé, et envoie les relances. Plus aucun impayé oublié. » |
| 3.3 | **Rapport financier** (`/dashboard/finance/rapports`) | « En fin de mois, le rapport est déjà prêt — recettes, dépenses, trésorerie. » |

**Message clé :** *« Zéro impayé qui passe entre les mailles. »*

---

## 4. PARENT — « L'effet waouh » (≈3 min) ⭐ GARDER POUR LA FIN

**Connexion :** `parent@school.dev` (Leila Parent) → `/dashboard/portail-parent`
> Montrer **sur un vrai téléphone** si possible (app mobile).

| Étape | Action | Phrase à dire |
|-------|--------|---------------|
| 4.1 | **Notes en temps réel** | « Souvenez-vous de la note saisie par Fatma il y a 2 minutes : la voici, déjà visible côté parent. » |
| 4.2 | **Absences** | « Et l'absence de ce matin : le parent est déjà au courant. » |
| 4.3 | **Factures / paiement** | « Il voit ce qu'il doit, et peut suivre ses paiements. » |
| 4.4 | **Messagerie** | « Et il échange directement avec l'école, sans appels téléphoniques perdus. » |

**Message clé :** *« Des parents informés et rassurés = une école qui se remplit toute seule. »*

---

## 5. (Optionnel) SITE VITRINE — différenciation (≈1 min)

| Étape | Action | Phrase à dire |
|-------|--------|---------------|
| 5.1 | Ouvrir le site public (`/vitrine/demo-school`) | « Et en bonus : chaque école obtient SON site web public, à ses couleurs, avec pré-inscription en ligne. Un canal d'acquisition d'élèves, inclus. » |

---

## Closing (après la démo)

1. **Multi-tenant** : « Tout ce que vous avez vu, c'est VOTRE école, isolée, avec votre logo et vos couleurs. »
2. **Tarif** : présenter le modèle (par élève / par mois — adapter).
3. **Prochaine étape** : « On vous crée un environnement de test avec vos vraies classes cette semaine ? »

---

## Plan B (si coupure réseau / bug)

- Avoir des **captures d'écran** de chaque étape ci-dessus dans un dossier `captures/`.
- Connaître les pages signalées fragiles (bugs sentinelle UUID sur Absences/Examens) — **les retester la veille**.
- Garder une **vidéo de secours** (screen-record du parcours complet).
