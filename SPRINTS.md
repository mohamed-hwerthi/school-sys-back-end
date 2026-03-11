# 🗓️ School Management System — Découpage en Sprints

> **Méthodologie** : Agile Scrum
> **Durée Sprint** : 2 semaines
> **Vélocité cible** : 20–24 story points / sprint
> **Équipe estimée** : 2 Fullstack + 1 Backend Lead
> **Date de début** : 2026-03-16

---

---

# ═══════════════════════════════════════════
# PHASE 1 — FONDATIONS SÉCURITÉ
# Sprints 1 → 3 (6 semaines)
# Objectif : Sécuriser l'application avant toute mise en prod
# ═══════════════════════════════════════════

---

## 🔵 SPRINT 1 — Authentification JWT & Modèle Utilisateurs

> **Dates** : 16 Mars → 29 Mars 2026
> **Objectif** : Login fonctionnel avec JWT
> **Capacité** : 23 story points

| Ticket | Titre | Board | Assigné | Points | Statut |
|--------|-------|-------|---------|--------|--------|
| SEC-001 | Implémenter JWT (access + refresh tokens) | Sécurité | Backend Lead | 5 | 📥 To Do |
| SEC-008 | Migration Flyway : tables users, roles, permissions | Sécurité | Backend Lead | 3 | 📥 To Do |
| SEC-003 | Endpoint POST /api/auth/login | Sécurité | Backend Lead | 3 | 📥 To Do |
| SEC-004 | Endpoint POST /api/auth/logout | Sécurité | Backend Lead | 2 | 📥 To Do |
| SEC-005 | Endpoint POST /api/auth/refresh-token | Sécurité | Backend Lead | 2 | 📥 To Do |
| SEC-002 | Page Login frontend (formulaire email/password) | Sécurité | Fullstack 1 | 3 | 📥 To Do |
| SEC-006 | PrivateRoute guard + redirect /login si non auth | Sécurité | Fullstack 1 | 3 | 📥 To Do |
| SEC-018 | Page 403 Forbidden | Sécurité | Fullstack 1 | 2 | 📥 To Do |

### Détails Techniques Sprint 1

```
BACKEND :
├── pom.xml : ajouter jjwt-api, jjwt-impl, jjwt-jackson
├── Migration V12__create_users_roles.sql :
│   ├── CREATE TABLE users (id, email, password_hash, nom, prenom, role, is_active, tenant_id, created_at)
│   ├── CREATE TYPE user_role AS ENUM ('SUPER_ADMIN','ADMIN','DIRECTEUR','ENSEIGNANT','COMPTABLE','PARENT')
│   └── CREATE TABLE refresh_tokens (id, user_id, token, expires_at, revoked)
├── JwtTokenProvider.java : generateAccessToken(), generateRefreshToken(), validateToken(), getUserIdFromToken()
├── JwtAuthenticationFilter.java extends OncePerRequestFilter
├── AuthController.java : login(), logout(), refreshToken()
├── AuthService.java : authenticate(), createTokens(), revokeToken()
├── UserDetailsServiceImpl.java implements UserDetailsService
└── SecurityConfig.java : modifier .permitAll() → .authenticated() (sauf /api/auth/**)

FRONTEND :
├── src/pages/Login.tsx : formulaire React Hook Form + Zod
├── src/hooks/useAuth.ts : login(), logout(), getUser(), isAuthenticated()
├── src/contexts/AuthContext.tsx : AuthProvider, useAuthContext()
├── src/components/PrivateRoute.tsx : redirect si !authenticated
├── src/lib/axios.ts : interceptor pour ajouter Authorization header + refresh auto
├── src/pages/Forbidden.tsx : page 403
└── Modifier App.tsx : wrapper routes avec PrivateRoute
```

### Definition of Done Sprint 1
- [ ] Un utilisateur peut se connecter avec email/password
- [ ] Le JWT est stocké et envoyé à chaque requête API
- [ ] Le refresh token renouvelle automatiquement le access token
- [ ] Les routes frontend redirigent vers /login si non authentifié
- [ ] La déconnexion invalide le token côté serveur
- [ ] Tests unitaires AuthService (min 5 tests)

---

## 🔵 SPRINT 2 — Rôles, Permissions & Gestion Utilisateurs

> **Dates** : 30 Mars → 12 Avril 2026
> **Objectif** : RBAC complet + CRUD utilisateurs
> **Capacité** : 22 story points

| Ticket | Titre | Board | Assigné | Points | Statut |
|--------|-------|-------|---------|--------|--------|
| SEC-007 | Définir rôles & matrice permissions (config) | Sécurité | Backend Lead | 3 | 📥 To Do |
| SEC-010 | Implémenter matrice permissions backend (@PreAuthorize) | Sécurité | Backend Lead | 5 | 📥 To Do |
| SEC-011 | Ajouter @PreAuthorize sur tous les controllers existants | Sécurité | Backend Lead | 5 | 📥 To Do |
| SEC-009 | CRUD Utilisateurs (API + page admin) | Sécurité | Fullstack 1 | 5 | 📥 To Do |
| SEC-012 | Menus sidebar conditionnels selon rôle | Sécurité | Fullstack 2 | 3 | 📥 To Do |
| TECH-010 | ErrorBoundary frontend + ExceptionHandler backend amélioré | Technique | Fullstack 2 | 1 | 📥 To Do |

### Détails Techniques Sprint 2

```
BACKEND :
├── PermissionEnum.java :
│   ├── STUDENTS_READ, STUDENTS_WRITE, STUDENTS_DELETE
│   ├── NOTES_READ, NOTES_WRITE
│   ├── FINANCE_READ, FINANCE_WRITE
│   ├── USERS_MANAGE, SETTINGS_MANAGE
│   └── REPORTS_VIEW, ABSENCES_MANAGE...
├── RolePermissionConfig.java : Map<Role, Set<Permission>>
│   ├── SUPER_ADMIN → ALL
│   ├── ADMIN → ALL sauf SUPER_ADMIN actions
│   ├── DIRECTEUR → READ ALL + WRITE (settings, validations)
│   ├── ENSEIGNANT → STUDENTS_READ, NOTES_WRITE, ABSENCES_MANAGE
│   ├── COMPTABLE → FINANCE_READ, FINANCE_WRITE, STUDENTS_READ
│   └── PARENT → STUDENTS_READ (own child), NOTES_READ (own child)
├── @PreAuthorize("hasPermission('STUDENTS_WRITE')") sur chaque endpoint
├── UserController.java : CRUD complet
└── UserService.java : create, update, delete, toggleActive, changePassword

FRONTEND :
├── src/pages/admin/Users.tsx : DataTable utilisateurs + actions
├── src/components/UserForm.tsx : création/édition utilisateur
├── src/hooks/useUsers.ts : React Query hooks
├── src/hooks/usePermissions.ts : hasPermission(), canAccess()
├── src/components/layout/Sidebar.tsx : filtrer items selon permissions
└── src/components/PermissionGate.tsx : <PermissionGate permission="NOTES_WRITE">...</PermissionGate>
```

### Definition of Done Sprint 2
- [ ] Admin peut créer/modifier/désactiver des utilisateurs
- [ ] Chaque rôle n'accède qu'à ses modules autorisés
- [ ] La sidebar affiche uniquement les menus autorisés
- [ ] Les endpoints API refusent les accès non autorisés (403)
- [ ] Un enseignant ne peut pas accéder aux finances
- [ ] Un comptable ne peut pas modifier les notes

---

## 🔵 SPRINT 3 — Sécurité Avancée & Tenant Management

> **Dates** : 13 Avril → 26 Avril 2026
> **Objectif** : Reset password, verrouillage, provisioning tenants
> **Capacité** : 21 story points

| Ticket | Titre | Board | Assigné | Points | Statut |
|--------|-------|-------|---------|--------|--------|
| SEC-013 | Reset password (envoi email + lien temporaire) | Sécurité | Backend Lead | 5 | 📥 To Do |
| SEC-014 | Verrouillage compte après 5 échecs | Sécurité | Backend Lead | 3 | 📥 To Do |
| SEC-015 | Journal des connexions (audit log login) | Sécurité | Backend Lead | 3 | 📥 To Do |
| SYS-005 | CRUD tenants + provisioning auto schéma | Système | Backend Lead | 5 | 📥 To Do |
| COM-006 | Intégration email SMTP (service de base) | Communication | Fullstack 1 | 3 | 📥 To Do |
| TECH-005 | Docker : Dockerfile front + back + docker-compose | Technique | Fullstack 2 | 2 | 📥 To Do |

### Détails Techniques Sprint 3

```
BACKEND :
├── PasswordResetService.java :
│   ├── generateResetToken() → token UUID, expiration 1h, stocké en DB
│   ├── sendResetEmail() → lien https://app/reset-password?token=xxx
│   └── resetPassword() → valider token + update password
├── LoginAttemptService.java :
│   ├── Table login_attempts (user_id, attempt_count, locked_until)
│   ├── Incrémenter à chaque échec
│   ├── Verrouiller 15 min après 5 échecs
│   └── Reset compteur après succès
├── LoginAuditService.java :
│   ├── Table login_audit (user_id, timestamp, ip, user_agent, success)
│   └── Page admin : historique connexions filtrable
├── TenantProvisioningService.java :
│   ├── createTenant(name) → INSERT tenants + CREATE SCHEMA + run Flyway
│   └── deleteTenant(id) → DROP SCHEMA (avec confirmation)
├── EmailService.java :
│   ├── spring-boot-starter-mail
│   ├── Thymeleaf templates (reset-password.html)
│   └── @Async pour envoi non-bloquant

DOCKER :
├── school-system-back/Dockerfile
│   ├── FROM maven:3.9-eclipse-temurin-17 AS build
│   ├── RUN mvn package -DskipTests
│   └── FROM eclipse-temurin:17-jre-alpine (runtime)
├── school-system-front/Dockerfile
│   ├── FROM node:20-alpine AS build
│   ├── RUN npm run build
│   └── FROM nginx:alpine (serve static)
└── docker-compose.yml : postgres + backend + frontend + volumes
```

### Definition of Done Sprint 3
- [ ] Un utilisateur peut réinitialiser son mot de passe par email
- [ ] Un compte est verrouillé après 5 tentatives échouées
- [ ] Les connexions sont journalisées et consultables
- [ ] Un super admin peut créer un nouveau tenant (école)
- [ ] L'application tourne dans Docker (docker-compose up)

---

### ✅ JALON PHASE 1 : Application sécurisée, prête pour déploiement staging

---

---

# ═══════════════════════════════════════════
# PHASE 2 — CŒUR PÉDAGOGIQUE
# Sprints 4 → 6 (6 semaines)
# Objectif : Compléter les modules essentiels de la vie scolaire
# ═══════════════════════════════════════════

---

## 🟢 SPRINT 4 — Gestion des Absences

> **Dates** : 27 Avril → 10 Mai 2026
> **Objectif** : Système de présence complet
> **Capacité** : 23 story points

| Ticket | Titre | Board | Assigné | Points | Statut |
|--------|-------|-------|---------|--------|--------|
| ABS-001 | Migration Flyway : tables absences + justificatifs | Élèves | Backend Lead | 2 | 📥 To Do |
| ABS-002 | API CRUD absences (AbsenceController, Service, Repository) | Élèves | Backend Lead | 5 | 📥 To Do |
| ABS-003 | Page appel par classe/séance (UI grille interactive) | Élèves | Fullstack 1 | 8 | 📥 To Do |
| ABS-004 | Dashboard absences (stats, graphiques, filtres) | Élèves | Fullstack 2 | 5 | 📥 To Do |
| ABS-009 | Historique présence par élève (onglet fiche élève) | Élèves | Fullstack 2 | 3 | 📥 To Do |

### Détails Techniques Sprint 4

```
MIGRATION V12__absences.sql :
├── CREATE TABLE absences (
│   id BIGSERIAL PRIMARY KEY,
│   eleve_id BIGINT REFERENCES eleves(id),
│   date DATE NOT NULL,
│   type VARCHAR(10) CHECK (type IN ('ABSENCE', 'RETARD')),
│   seance VARCHAR(30), -- 'MATIN_1', 'MATIN_2', 'APRES_MIDI_1'...
│   heure_arrivee TIME, -- si retard
│   justifie BOOLEAN DEFAULT FALSE,
│   motif TEXT,
│   enseignant_id BIGINT REFERENCES enseignants(id),
│   created_at TIMESTAMP DEFAULT NOW()
│ );
├── CREATE TABLE justificatifs (
│   id BIGSERIAL PRIMARY KEY,
│   absence_id BIGINT REFERENCES absences(id),
│   fichier_url VARCHAR(500),
│   date_soumission TIMESTAMP DEFAULT NOW(),
│   valide BOOLEAN
│ );
└── CREATE INDEX idx_absences_eleve_date ON absences(eleve_id, date);

API ENDPOINTS :
├── POST   /api/absences/batch         → Saisie appel (liste d'absences)
├── GET    /api/absences?classeId=&date=&type=  → Liste filtrée
├── GET    /api/absences/eleve/{id}     → Historique par élève
├── PUT    /api/absences/{id}/justifier → Marquer comme justifié
├── GET    /api/absences/stats?classeId=&mois=  → Statistiques
├── DELETE /api/absences/{id}           → Supprimer
└── GET    /api/absences/rapport?classeId=&mois= → Rapport PDF/Excel

PAGE APPEL (ABS-003) :
├── Sélecteurs : Date (défaut=aujourd'hui) + Classe + Séance
├── Charger liste élèves de la classe → GET /api/eleves?classeId=
├── Pour chaque élève : 3 boutons radio (Présent ✅ | Absent ❌ | Retard ⏰)
├── Si Retard → champ heure_arrivee (TimePicker)
├── Bouton "Valider l'appel" → POST /api/absences/batch
├── Toast confirmation "Appel enregistré pour 3A - Matin 1"
└── Rappel visuel si appel déjà saisi pour cette séance
```

### Definition of Done Sprint 4
- [ ] L'enseignant peut faire l'appel par classe et séance
- [ ] Les absences et retards sont enregistrés avec date et séance
- [ ] Le dashboard affiche les statistiques par classe et période
- [ ] L'historique de présence apparaît dans la fiche élève
- [ ] L'API retourne les stats pour les graphiques (Recharts)

---

## 🟢 SPRINT 5 — Emploi du Temps

> **Dates** : 11 Mai → 24 Mai 2026
> **Objectif** : Création et affichage des emplois du temps
> **Capacité** : 24 story points

| Ticket | Titre | Board | Assigné | Points | Statut |
|--------|-------|-------|---------|--------|--------|
| EDT-001 | Migration Flyway : tables creneaux + emploi_du_temps | Pédagogie | Backend Lead | 3 | 📥 To Do |
| EDT-002 | API CRUD créneaux et emploi du temps | Pédagogie | Backend Lead | 5 | 📥 To Do |
| EDT-004 | Détection conflits (enseignant/salle en double) | Pédagogie | Backend Lead | 3 | 📥 To Do |
| EDT-003 | Page création EDT (grille hebdo + drag & drop) | Pédagogie | Fullstack 1 | 8 | 📥 To Do |
| EDT-005 | Vue EDT enseignant personnel | Pédagogie | Fullstack 2 | 3 | 📥 To Do |
| EDT-008 | Export EDT en PDF | Pédagogie | Fullstack 2 | 2 | 📥 To Do |

### Détails Techniques Sprint 5

```
MIGRATION V13__emploi_du_temps.sql :
├── CREATE TABLE creneaux (
│   id BIGSERIAL PRIMARY KEY,
│   label VARCHAR(50) NOT NULL,     -- 'Séance 1', 'Séance 2'...
│   heure_debut TIME NOT NULL,      -- 08:00
│   heure_fin TIME NOT NULL,        -- 09:00
│   type VARCHAR(20) DEFAULT 'COURS' -- 'COURS', 'PAUSE', 'RECREATION'
│ );
├── CREATE TABLE emploi_du_temps (
│   id BIGSERIAL PRIMARY KEY,
│   classe_id BIGINT REFERENCES classes(id),
│   creneau_id BIGINT REFERENCES creneaux(id),
│   jour_semaine INTEGER CHECK (jour_semaine BETWEEN 1 AND 6),
│   module_id BIGINT REFERENCES modules(id),
│   enseignant_id BIGINT REFERENCES enseignants(id),
│   salle VARCHAR(50),
│   UNIQUE(enseignant_id, creneau_id, jour_semaine),
│   UNIQUE(classe_id, creneau_id, jour_semaine),
│   UNIQUE(salle, creneau_id, jour_semaine)
│ );
└── INSERT INTO creneaux (créneaux par défaut : 8h-9h, 9h-10h, pause, 10h15-11h15...)

PAGE EDT (EDT-003) :
├── Layout grille :
│   ├── Colonnes : Lundi | Mardi | Mercredi | Jeudi | Vendredi | Samedi
│   ├── Lignes : Créneaux horaires (8h→12h, 14h→17h)
│   └── Cellules : Module + Enseignant + Salle (carte colorée par domaine)
├── Panel latéral : liste modules/enseignants disponibles (draggable)
├── Drag & drop : @dnd-kit/core
├── Validation temps réel :
│   ├── 🔴 Conflit enseignant → "M. Benali déjà assigné Lundi 8h en 4B"
│   ├── 🔴 Conflit salle → "Salle A3 occupée Lundi 8h par 3A"
│   └── 🟡 Volume horaire → "Maths: 4h/5h prévues cette semaine"
├── Bouton "Sauvegarder" → PUT /api/emploi-du-temps/classe/{id}
└── Bouton "Dupliquer depuis" → copier EDT d'une autre classe
```

### Definition of Done Sprint 5
- [ ] L'admin peut créer un EDT par classe avec drag & drop
- [ ] Les conflits enseignant/salle sont détectés en temps réel
- [ ] L'enseignant voit son EDT personnel
- [ ] L'EDT est exportable en PDF
- [ ] Les créneaux horaires sont configurables

---

## 🟢 SPRINT 6 — Notes Avancées, Bulletins & Année Scolaire

> **Dates** : 25 Mai → 7 Juin 2026
> **Objectif** : Compléter le cycle note → bulletin → passage
> **Capacité** : 24 story points

| Ticket | Titre | Board | Assigné | Points | Statut |
|--------|-------|-------|---------|--------|--------|
| NOT-005 | Saisie notes par lot (grille rapide + auto-save) | Pédagogie | Fullstack 1 | 5 | 📥 To Do |
| NOT-008 | Verrouillage saisie notes après date limite | Pédagogie | Backend Lead | 3 | 📥 To Do |
| BUL-003 | Template bulletin personnalisable (logo, en-tête AR/FR) | Pédagogie | Fullstack 2 | 5 | 📥 To Do |
| BUL-004 | Génération bulletins en masse (par classe) + ZIP | Pédagogie | Backend Lead | 5 | 📥 To Do |
| ANN-003 | Configuration nouvelle année (trimestres, vacances) | Année | Fullstack 1 | 3 | 📥 To Do |
| ANN-007 | Calendrier scolaire (vacances, fériés, événements) | Année | Fullstack 2 | 3 | 📥 To Do |

### Détails Techniques Sprint 6

```
NOT-005 : Saisie par lot
├── Grille type tableur :
│   ├── Lignes = élèves de la classe (triés alphabétiquement)
│   ├── Colonnes = examens du trimestre pour le module sélectionné
│   └── Cellules = input numérique (0-20), tab pour naviguer
├── Auto-save : debounce 2s après dernière modification
├── Indicateur : 💾 Sauvegardé | ⏳ Sauvegarde en cours | ❌ Erreur
├── Validation : min=0, max=20, pas de lettres
├── Couleurs : <5 rouge, 5-10 orange, 10-15 bleu, >15 vert
└── POST /api/notes/batch → [{eleveId, examenId, valeur}]

BUL-003 : Template bulletin
├── Settings école : upload logo, en-tête FR, en-tête AR
├── Template configurable :
│   ├── Sections affichées : domaines, sous-domaines, moyennes
│   ├── Afficher/masquer : classement, appréciation générale, signature
│   ├── Orientation : portrait/paysage
│   └── Langue : FR seul, AR seul, bilingue
├── Preview temps réel dans l'admin
└── Stockage config en JSON dans school_settings

BUL-004 : Génération masse
├── Sélection : Classe + Trimestre → Générer
├── Backend : @Async → génération PDF en background
│   ├── Pour chaque élève de la classe
│   ├── Calculer moyennes domaine/sous-domaine/module
│   ├── Appliquer template → PDF (iText / JasperReports)
│   └── Zipper tous les PDFs
├── Frontend : progress bar (polling ou WebSocket)
├── Résultat : lien téléchargement ZIP
└── Nommage : Bulletin_3A_T1_NomPrenom.pdf
```

### Definition of Done Sprint 6
- [ ] L'enseignant saisit les notes rapidement en grille avec auto-save
- [ ] La saisie est verrouillée après la date limite du trimestre
- [ ] Le bulletin est personnalisable (logo, en-tête, sections)
- [ ] Les bulletins sont générés en masse par classe (ZIP téléchargeable)
- [ ] L'admin peut configurer les dates de la nouvelle année scolaire
- [ ] Le calendrier scolaire affiche vacances et jours fériés

---

### ✅ JALON PHASE 2 : Cycle pédagogique complet (absences → notes → bulletins)

---

---

# ═══════════════════════════════════════════
# PHASE 3 — FINANCE & COMMUNICATION
# Sprints 7 → 9 (6 semaines)
# Objectif : Automatiser la facturation et ouvrir les canaux de communication
# ═══════════════════════════════════════════

---

## 🟡 SPRINT 7 — Facturation & Notifications Email/SMS

> **Dates** : 8 Juin → 21 Juin 2026
> **Objectif** : Factures, reçus, intégration SMS
> **Capacité** : 23 story points

| Ticket | Titre | Board | Assigné | Points | Statut |
|--------|-------|-------|---------|--------|--------|
| FIN-010 | Génération factures PDF (numérotation séquentielle) | Finance | Backend Lead | 5 | 📥 To Do |
| FIN-011 | Reçu de paiement PDF | Finance | Backend Lead | 3 | 📥 To Do |
| FIN-012 | Échéanciers de paiement (N mensualités) | Finance | Fullstack 1 | 5 | 📥 To Do |
| COM-007 | Intégration SMS (Twilio/Vonage) | Communication | Fullstack 2 | 5 | 📥 To Do |
| ABS-005 | Notification SMS/email parents (absence) | Élèves | Fullstack 2 | 3 | 📥 To Do |
| ABS-006 | Configuration seuils d'alerte absences | Élèves | Fullstack 1 | 2 | 📥 To Do |

### Détails Techniques Sprint 7

```
FIN-010 : Factures PDF
├── Table factures (id, numero, eleve_id, date_emission, date_echeance,
│   montant_ht, montant_ttc, statut, pdf_url)
├── Numérotation : FAC-{année}-{seq:5} → FAC-2026-00001
├── Template PDF :
│   ├── En-tête : logo + infos école (depuis school_settings)
│   ├── Destinataire : parent de l'élève
│   ├── Tableau : type_frais | description | quantité | montant
│   ├── Sous-total, remise, total net
│   └── Pied : mode de paiement, RIB, conditions
├── Endpoint : GET /api/factures/{id}/pdf → application/pdf
└── Endpoint : POST /api/factures/generer?classeId=&typeFraisId= → masse

FIN-012 : Échéanciers
├── Table echeanciers (id, eleve_id, type_frais_id, montant_total,
│   nb_mensualites, date_debut)
├── Table echeances (id, echeancier_id, numero, montant, date_echeance,
│   statut[PAYEE/EN_ATTENTE/EN_RETARD], paiement_id)
├── À la création : calculer automatiquement les N dates
├── Cron job : chaque jour → vérifier échéances passées → marquer EN_RETARD
└── UI : timeline visuelle des échéances avec statut coloré

COM-007 : SMS
├── Dépendance : twilio SDK (com.twilio.sdk:twilio:9.x)
├── SmsService.java : sendSms(to, message)
├── Templates SMS :
│   ├── ABSENCE : "Votre enfant {nom} était absent le {date}. Contact: {tel_ecole}"
│   ├── RELANCE : "Rappel: échéance de {montant} DH due le {date}. Merci de régulariser."
│   └── GENERAL : "{message}" (custom)
├── Config : application.yml → twilio.account-sid, auth-token, from-number
└── Table sms_log (id, to, message, statut[SENT/FAILED], sent_at)
```

### Definition of Done Sprint 7
- [ ] Les factures sont générées en PDF avec numérotation séquentielle
- [ ] Les reçus de paiement sont imprimables en PDF
- [ ] Les échéanciers sont créés avec suivi automatique des échéances
- [ ] Les SMS sont envoyés via Twilio (absences, relances)
- [ ] Les parents reçoivent une notification en cas d'absence

---

## 🟡 SPRINT 8 — Messagerie Interne & Temps Réel

> **Dates** : 22 Juin → 5 Juillet 2026
> **Objectif** : Messagerie + notifications WebSocket
> **Capacité** : 22 story points

| Ticket | Titre | Board | Assigné | Points | Statut |
|--------|-------|-------|---------|--------|--------|
| COM-004 | WebSocket setup (Spring + SockJS + STOMP) | Communication | Backend Lead | 5 | 📥 To Do |
| COM-005 | Notifications temps réel (badge, dropdown, son) | Communication | Fullstack 1 | 5 | 📥 To Do |
| COM-001 | Messagerie interne backend (messages table + API) | Communication | Backend Lead | 3 | 📥 To Do |
| COM-002 | UI Boîte de réception (inbox, envoyés, brouillons) | Communication | Fullstack 1 | 5 | 📥 To Do |
| COM-003 | Circulaires (envoi groupé par classe/niveau) | Communication | Fullstack 2 | 2 | 📥 To Do |
| COM-008 | Templates notifications configurables | Communication | Fullstack 2 | 2 | 📥 To Do |

### Détails Techniques Sprint 8

```
COM-004 : WebSocket
├── pom.xml : spring-boot-starter-websocket
├── WebSocketConfig.java :
│   ├── @EnableWebSocketMessageBroker
│   ├── registerStompEndpoints("/ws") → withSockJS()
│   └── configureMessageBroker → /topic, /queue
├── NotificationController.java :
│   └── @MessageMapping + @SendToUser
├── Frontend :
│   ├── npm install @stomp/stompjs sockjs-client
│   ├── src/contexts/WebSocketContext.tsx
│   ├── Connexion auto au login, déconnexion au logout
│   └── Subscribe : /user/queue/notifications

COM-001 : Messages
├── Table messages (id, sender_id, subject, body, type[MESSAGE/CIRCULAIRE],
│   created_at)
├── Table message_recipients (id, message_id, recipient_id, read_at, deleted)
├── API :
│   ├── POST /api/messages → envoyer
│   ├── GET  /api/messages/inbox → reçus (paginé)
│   ├── GET  /api/messages/sent → envoyés
│   ├── PUT  /api/messages/{id}/read → marquer lu
│   └── DELETE /api/messages/{id} → supprimer (soft)
└── Notification WebSocket à la réception

COM-002 : UI Messagerie
├── Layout 3 colonnes : Dossiers | Liste messages | Lecture message
├── Dossiers : 📥 Boîte de réception (badge non-lus), 📤 Envoyés, 📝 Brouillons
├── Composer : destinataire(s) autocomplete, sujet, body (rich text basique)
├── Actions : Répondre, Transférer, Supprimer
└── Recherche dans les messages
```

### Definition of Done Sprint 8
- [ ] Les notifications arrivent en temps réel (WebSocket)
- [ ] Le badge de notification s'incrémente sans refresh
- [ ] La messagerie interne est fonctionnelle (envoyer, recevoir, lire)
- [ ] Les circulaires sont envoyées en masse par classe/niveau
- [ ] Les templates de notifications sont configurables

---

## 🟡 SPRINT 9 — Relances Automatiques, Bilan & Audit

> **Dates** : 6 Juillet → 19 Juillet 2026
> **Objectif** : Automatisations financières + traçabilité
> **Capacité** : 21 story points

| Ticket | Titre | Board | Assigné | Points | Statut |
|--------|-------|-------|---------|--------|--------|
| FIN-014 | Escalade automatique impayés (J+7→J+15→J+30) | Finance | Backend Lead | 5 | 📥 To Do |
| FIN-013 | Envoi factures par email | Finance | Backend Lead | 3 | 📥 To Do |
| FIN-015 | Bilan financier annuel (PDF/Excel) | Finance | Fullstack 1 | 5 | 📥 To Do |
| SYS-007 | Audit trail complet (toutes actions CRUD) | Système | Backend Lead | 5 | 📥 To Do |
| ABS-007 | Rapport mensuel présence (PDF/Excel) | Élèves | Fullstack 2 | 3 | 📥 To Do |

### Détails Techniques Sprint 9

```
FIN-014 : Escalade impayés
├── Scheduler : @Scheduled(cron = "0 0 8 * * *") → chaque jour 8h
├── Logique :
│   ├── Chercher paiements EN_RETARD
│   ├── Si retard > 7j et pas de relance → Relance 1 (email)
│   ├── Si retard > 15j et 1 relance → Relance 2 (SMS + email)
│   ├── Si retard > 30j et 2 relances → Mise en demeure (courrier)
│   └── Appliquer pénalité automatique si configuré
├── Dashboard comptable : vue impayés avec countdown
└── Config par école : jours seuils, montant pénalité, activation

SYS-007 : Audit Trail
├── Approche : Spring AOP
├── @Aspect AuditAspect → intercepter @Service methods annotées @Audited
├── Table audit_log (id, user_id, action, entity_type, entity_id,
│   old_value JSONB, new_value JSONB, ip_address, timestamp)
├── Sérialiser old/new en JSON avant/après modification
├── Page traçabilité (existante) → brancher sur vraies données
├── Filtres : utilisateur, action, entité, période
└── Export CSV pour audit externe

FIN-015 : Bilan Financier
├── Revenus : par type de frais, par mois, par classe
├── Dépenses : par catégorie (fixe/variable), par mois
├── Résultat : Revenus - Dépenses = Solde
├── Graphiques : barres empilées (mois), camembert (catégories)
├── Export PDF : rapport complet avec graphiques + tableaux
├── Export Excel : données brutes avec formules
└── Comparaison N-1 si données disponibles
```

### Definition of Done Sprint 9
- [ ] Les impayés sont relancés automatiquement selon l'escalade configurée
- [ ] Les factures sont envoyées par email automatiquement
- [ ] Le bilan financier annuel est généré en PDF et Excel
- [ ] Toutes les actions CRUD sont tracées dans l'audit log
- [ ] Le rapport de présence mensuel est exportable

---

### ✅ JALON PHASE 3 : Facturation automatisée + Communication opérationnelle

---

---

# ═══════════════════════════════════════════
# PHASE 4 — OUVERTURE & ANALYTICS
# Sprints 10 → 12 (6 semaines)
# Objectif : Portail parent + dashboard avancé + stabilisation
# ═══════════════════════════════════════════

---

## 🟠 SPRINT 10 — Portail Parent (Base)

> **Dates** : 20 Juillet → 2 Août 2026
> **Objectif** : Espace parent fonctionnel
> **Capacité** : 23 story points

| Ticket | Titre | Board | Assigné | Points | Statut |
|--------|-------|-------|---------|--------|--------|
| PAR-001 | Layout portail parent (sidebar, routing /parent/*) | Portail Parent | Fullstack 1 | 5 | 📥 To Do |
| PAR-002 | Login parent (credentials envoyés à l'inscription) | Portail Parent | Backend Lead | 3 | 📥 To Do |
| PAR-003 | Dashboard parent (résumé enfant) | Portail Parent | Fullstack 1 | 5 | 📥 To Do |
| PAR-004 | Fiche profil enfant (lecture seule) | Portail Parent | Fullstack 2 | 2 | 📥 To Do |
| PAR-005 | Consultation notes & bulletins (parent) | Portail Parent | Fullstack 2 | 5 | 📥 To Do |
| RPT-003 | Dashboard exécutif enrichi (KPIs temps réel) | Reporting | Fullstack 1 | 3 | 📥 To Do |

### Détails Techniques Sprint 10

```
PAR-001 : Layout Parent
├── Route : /parent/* (séparé du /admin/*)
├── Guard : role === 'PARENT', sinon redirect /login
├── Sidebar items :
│   ├── 🏠 Accueil (dashboard)
│   ├── 👤 Mon Enfant (profil)
│   ├── 📊 Notes & Bulletins
│   ├── 📅 Absences
│   ├── 🕐 Emploi du Temps
│   ├── 💰 Paiements
│   ├── 📨 Messages
│   └── 📄 Circulaires
├── Header : "Bienvenue, M./Mme {nom}" + sélecteur enfant (si plusieurs)
├── Thème : même design system mais palette adaptée
└── Mobile-first : responsive prioritaire pour les parents

PAR-002 : Login Parent
├── À l'inscription d'un élève :
│   ├── Créer auto un compte parent si email parent renseigné
│   ├── Générer mot de passe temporaire
│   ├── Envoyer email avec credentials + lien première connexion
│   └── Forcer changement mot de passe à la 1ère connexion
├── Liaison parent-élève : table parent_eleve (parent_id, eleve_id)
└── Un parent peut avoir plusieurs enfants

PAR-003 : Dashboard Parent
├── Carte enfant : photo, nom, classe, enseignant principal
├── Widget notes : dernières notes + moyenne actuelle
├── Widget absences : nombre ce mois + dernière absence
├── Widget paiements : prochain échéance + solde restant
├── Widget messages : nombre non-lus
└── Alertes : notes < 10, absences non justifiées, échéance proche
```

### Definition of Done Sprint 10
- [ ] Le parent peut se connecter à son espace dédié
- [ ] Le dashboard affiche un résumé de la situation de l'enfant
- [ ] Le parent peut consulter les notes et télécharger les bulletins
- [ ] Le profil de l'enfant est visible en lecture seule
- [ ] Le dashboard admin est enrichi avec de nouveaux KPIs

---

## 🟠 SPRINT 11 — Contrats Enseignants, Tests & CI/CD

> **Dates** : 3 Août → 16 Août 2026
> **Objectif** : RH enseignants + qualité logicielle
> **Capacité** : 22 story points

| Ticket | Titre | Board | Assigné | Points | Statut |
|--------|-------|-------|---------|--------|--------|
| ENS-003 | Contrats enseignants (type, dates, renouvellement) | Enseignants | Fullstack 1 | 5 | 📥 To Do |
| ENS-004 | Suivi absences enseignants (congés, maladie) | Enseignants | Fullstack 2 | 3 | 📥 To Do |
| TECH-001 | Tests unitaires backend (services critiques, > 80%) | Technique | Backend Lead | 5 | 📥 To Do |
| TECH-002 | Tests frontend (hooks & composants critiques) | Technique | Fullstack 2 | 5 | 📥 To Do |
| TECH-003 | CI/CD Pipeline GitHub Actions | Technique | Backend Lead | 4 | 📥 To Do |

### Détails Techniques Sprint 11

```
TECH-001 : Tests Backend
├── AuthServiceTest.java (login, refresh, reset password)
├── StudentServiceTest.java (CRUD, filtres, import)
├── NoteServiceTest.java (saisie, calcul moyennes, verrouillage)
├── PaiementServiceTest.java (paiement, échéancier, relance)
├── AbsenceServiceTest.java (appel, stats, seuils)
├── TenantServiceTest.java (provisioning, isolation)
├── Mocks : @MockBean repositories
├── Outil : JUnit 5 + Mockito + AssertJ
├── Couverture : JaCoCo plugin → rapport HTML
└── Objectif : > 80% sur services, > 60% global

TECH-002 : Tests Frontend
├── useAuth.test.ts (login, logout, refresh, permissions)
├── useStudents.test.ts (fetch, create, filter)
├── LoginPage.test.tsx (formulaire, validation, submit)
├── AbsencePage.test.tsx (grille appel, toggle, submit)
├── PrivateRoute.test.tsx (redirect si non auth)
├── Outil : Vitest + @testing-library/react + msw (mock API)
└── Objectif : > 70% composants critiques

TECH-003 : CI/CD
├── .github/workflows/ci.yml :
│   ├── on: [push: main, pull_request]
│   ├── job backend: checkout → setup-java → mvn test → jacoco
│   ├── job frontend: checkout → setup-node → pnpm install → vitest → build
│   ├── job lint: eslint (front) + checkstyle (back)
│   └── job docker: build images → push registry (on main only)
├── .github/workflows/deploy-staging.yml :
│   └── on workflow_dispatch → deploy to staging server
└── Branch protection : require CI pass + 1 review
```

### Definition of Done Sprint 11
- [ ] Les contrats enseignants sont gérés (CRUD + alertes expiration)
- [ ] Les absences enseignants sont suivies
- [ ] Les tests backend couvrent > 80% des services
- [ ] Les tests frontend couvrent les hooks et composants critiques
- [ ] Le pipeline CI/CD exécute tests + build à chaque PR

---

## 🟠 SPRINT 12 — Année Scolaire, Portail Parent Complet & Stabilisation

> **Dates** : 17 Août → 30 Août 2026
> **Objectif** : Transition année + compléter portail + bug fixes
> **Capacité** : 23 story points

| Ticket | Titre | Board | Assigné | Points | Statut |
|--------|-------|-------|---------|--------|--------|
| ANN-002 | Workflow clôture année scolaire | Année | Backend Lead | 8 | 📥 To Do |
| ANN-004 | Promotion/redoublement en masse | Année | Backend Lead | 5 | 📥 To Do |
| PAR-006 | Consultation absences + justification (parent) | Portail Parent | Fullstack 1 | 3 | 📥 To Do |
| PAR-007 | Emploi du temps classe (vue parent) | Portail Parent | Fullstack 2 | 2 | 📥 To Do |
| PAR-009 | Circulaires reçues (vue parent) | Portail Parent | Fullstack 2 | 2 | 📥 To Do |
| TECH-004 | Documentation API OpenAPI complète | Technique | Fullstack 1 | 3 | 📥 To Do |

### Definition of Done Sprint 12
- [ ] L'admin peut clôturer une année scolaire (workflow complet)
- [ ] La promotion/redoublement en masse fonctionne
- [ ] Le parent peut voir les absences et justifier en ligne
- [ ] Le parent voit l'emploi du temps et les circulaires
- [ ] La documentation Swagger est complète pour tous les endpoints

---

### ✅ JALON PHASE 4 : V1.0 Production Ready — Portail parent + Analytics + CI/CD

---

---

# ═══════════════════════════════════════════
# PHASE 5 — ENRICHISSEMENT
# Sprints 13 → 16 (8 semaines)
# Objectif : Fonctionnalités avancées et scalabilité
# ═══════════════════════════════════════════

---

## 🟣 SPRINT 13 — Paiement en Ligne & Portail Parent Avancé

> **Dates** : 31 Août → 13 Septembre 2026
> **Capacité** : 21 story points

| Ticket | Titre | Board | Assigné | Points | Statut |
|--------|-------|-------|---------|--------|--------|
| FIN-016 | Intégration Stripe (paiement en ligne) | Finance | Backend Lead | 8 | 📥 To Do |
| FIN-017 | Webhook Stripe réconciliation auto | Finance | Backend Lead | 3 | 📥 To Do |
| PAR-008 | Factures & historique paiements (parent) | Portail Parent | Fullstack 1 | 3 | 📥 To Do |
| PAR-011 | Paiement en ligne depuis portail parent | Portail Parent | Fullstack 1 | 2 | 📥 To Do |
| PAR-010 | Messagerie parent ↔ enseignant | Portail Parent | Fullstack 2 | 3 | 📥 To Do |
| COM-011 | Suivi lecture circulaires (accusé réception) | Communication | Fullstack 2 | 2 | 📥 To Do |

---

## 🟣 SPRINT 14 — Tests E2E, i18n & Performance

> **Dates** : 14 Septembre → 27 Septembre 2026
> **Capacité** : 22 story points

| Ticket | Titre | Board | Assigné | Points | Statut |
|--------|-------|-------|---------|--------|--------|
| TECH-006 | Tests E2E Playwright (parcours critiques) | Technique | Fullstack 1 | 8 | 📥 To Do |
| TECH-007 | i18n — Français, Arabe (RTL), Anglais | Technique | Fullstack 2 | 5 | 📥 To Do |
| TECH-008 | Performance : lazy loading, Redis cache | Technique | Backend Lead | 5 | 📥 To Do |
| NOT-007 | Barème de notation configurable (0-10, 0-20, lettres) | Pédagogie | Fullstack 1 | 2 | 📥 To Do |
| ELV-012 | Fiche élève PDF complète | Élèves | Fullstack 2 | 2 | 📥 To Do |

```
TECH-006 : Tests E2E
├── Parcours 1 : Login → Dashboard → Voir élèves → Créer élève → Vérifier
├── Parcours 2 : Login enseignant → Faire appel → Saisir notes → Vérifier
├── Parcours 3 : Login comptable → Créer facture → Enregistrer paiement
├── Parcours 4 : Login parent → Voir notes → Télécharger bulletin
├── Parcours 5 : Login admin → Créer EDT → Vérifier conflits
├── Config : playwright.config.ts → baseURL, browsers
└── CI : ajouter job e2e au pipeline GitHub Actions

TECH-007 : i18n
├── npm install react-i18next i18next
├── src/i18n/ : fr.json, ar.json, en.json
├── Wrapper <I18nextProvider>
├── Remplacer tous les textes hardcodés par t('key')
├── RTL support : direction="rtl" conditionnel pour arabe
├── Sélecteur langue dans le header
└── Estimation : ~400 clés de traduction
```

---

## 🟣 SPRINT 15 — Reporting Avancé & Discipline

> **Dates** : 28 Septembre → 11 Octobre 2026
> **Capacité** : 20 story points

| Ticket | Titre | Board | Assigné | Points | Statut |
|--------|-------|-------|---------|--------|--------|
| RPT-004 | Constructeur rapports personnalisables | Reporting | Fullstack 1 | 5 | 📥 To Do |
| RPT-007 | Alertes intelligentes (baisse notes, absences, impayés) | Reporting | Backend Lead | 5 | 📥 To Do |
| DISC-001 | Table incidents + sanctions (Flyway) | Discipline | Backend Lead | 2 | 📥 To Do |
| DISC-002 | API incidents disciplinaires | Discipline | Backend Lead | 3 | 📥 To Do |
| DISC-003 | Formulaire signalement incident | Discipline | Fullstack 2 | 3 | 📥 To Do |
| COM-009 | Préférences notification par utilisateur | Communication | Fullstack 2 | 2 | 📥 To Do |

---

## 🟣 SPRINT 16 — Infrastructure, RH & Finalisation

> **Dates** : 12 Octobre → 25 Octobre 2026
> **Capacité** : 20 story points

| Ticket | Titre | Board | Assigné | Points | Statut |
|--------|-------|-------|---------|--------|--------|
| INF-001 | Inventaire salles (capacité, équipements) | Infrastructure | Fullstack 1 | 3 | 📥 To Do |
| INF-002 | Matériel pédagogique (inventaire, état) | Infrastructure | Fullstack 2 | 3 | 📥 To Do |
| ENS-005 | Demande de congé (workflow approbation) | Enseignants | Fullstack 1 | 3 | 📥 To Do |
| DISC-004 | Workflow sanction (avertissement→blâme→exclusion) | Discipline | Backend Lead | 3 | 📥 To Do |
| DISC-005 | Historique disciplinaire (timeline élève) | Discipline | Fullstack 2 | 3 | 📥 To Do |
| BUL-005 | Stats réussite par classe/module (histogrammes) | Pédagogie | Fullstack 1 | 3 | 📥 To Do |
| SYS-008 | Backup automatique quotidien par tenant | Système | Backend Lead | 2 | 📥 To Do |

---

### ✅ JALON PHASE 5 : V2.0 — Application complète avec tous les modules

---

---

# ═══════════════════════════════════════════
# BACKLOG FUTUR (Non planifié)
# Sprints 17+ — À prioriser selon retours utilisateurs
# ═══════════════════════════════════════════

| Ticket | Titre | Board | Points | Priorité |
|--------|-------|-------|--------|----------|
| SEC-016 | 2FA (TOTP authenticator) | Sécurité | 5 | 🟢 |
| SEC-017 | Sessions multi-appareils | Sécurité | 3 | 🟢 |
| FIN-019 | Rapprochement bancaire (import CSV/OFX) | Finance | 5 | 🟢 |
| FIN-020 | Gestion paie enseignants | Finance | 8 | 🟢 |
| SYS-006 | Dashboard super-admin multi-écoles | Système | 5 | 🟢 |
| SYS-009 | Gestion licences/abonnements SaaS | Système | 8 | 🟢 |
| SYS-010 | Monitoring Actuator dashboard | Système | 3 | 🟢 |
| RPT-005 | Comparatifs année/année (tendances 3-5 ans) | Reporting | 5 | 🟢 |
| RPT-006 | Rapports réglementaires (format ministériel) | Reporting | 5 | 🟢 |
| NOT-009 | Évaluation par compétences | Pédagogie | 5 | 🟢 |
| NOT-010 | Consultation notes portail parent | Pédagogie | 3 | 🟢 |
| BUL-006 | Attestation scolarité (template + QR code) | Pédagogie | 3 | 🟢 |
| BUL-007 | Comparatif performances inter-classes | Pédagogie | 3 | 🟢 |
| ABS-008 | Justification absence en ligne (parent upload) | Élèves | 3 | 🟢 |
| ELV-011 | Pré-inscription en ligne (parents) | Élèves | 5 | 🟢 |
| EDT-006 | Gestion remplacements enseignants | Pédagogie | 5 | 🟢 |
| EDT-007 | Vue EDT parent/élève lecture seule | Pédagogie | 2 | 🟢 |
| ENS-006 | Évaluation performance annuelle | Enseignants | 5 | 🟢 |
| ENS-007 | Catalogue formations continues | Enseignants | 3 | 🟢 |
| INF-003 | Bibliothèque scolaire | Infrastructure | 8 | 🟢 |
| INF-004 | Cantine scolaire | Infrastructure | 8 | 🟢 |
| INF-005 | Transport scolaire | Infrastructure | 5 | 🟢 |
| COM-010 | Fil discussion parent-enseignant | Communication | 3 | 🟢 |
| TECH-009 | Accessibilité WCAG 2.1 AA | Technique | 5 | 🟢 |
| DISC-006 | Notification parent incident | Discipline | 2 | 🟢 |
| ANN-005 | Affectation élèves nouvelles classes (auto/manuel) | Année | 5 | 🟢 |
| ANN-006 | Archivage données année précédente | Année | 5 | 🟢 |

---

---

# 📊 TABLEAU DE BORD GLOBAL DES SPRINTS

```
Sprint  │ Dates                  │ Phase │ Points │ Tickets │ Focus Principal
────────┼────────────────────────┼───────┼────────┼─────────┼──────────────────────────────
   1    │ 16 Mar → 29 Mar        │   1   │   23   │    8    │ JWT + Login + Users table
   2    │ 30 Mar → 12 Avr        │   1   │   22   │    6    │ RBAC + CRUD Users + Guards
   3    │ 13 Avr → 26 Avr        │   1   │   21   │    6    │ Reset pwd + Tenant + Docker
────────┼────────────────────────┼───────┼────────┼─────────┼──────────────────────────────
   4    │ 27 Avr → 10 Mai        │   2   │   23   │    5    │ Absences & Présence
   5    │ 11 Mai → 24 Mai        │   2   │   24   │    6    │ Emploi du Temps
   6    │ 25 Mai → 07 Jun        │   2   │   24   │    6    │ Notes avancées + Bulletins
────────┼────────────────────────┼───────┼────────┼─────────┼──────────────────────────────
   7    │ 08 Jun → 21 Jun        │   3   │   23   │    6    │ Factures + SMS + Alertes
   8    │ 22 Jun → 05 Jul        │   3   │   22   │    6    │ Messagerie + WebSocket
   9    │ 06 Jul → 19 Jul        │   3   │   21   │    5    │ Relances auto + Audit trail
────────┼────────────────────────┼───────┼────────┼─────────┼──────────────────────────────
  10    │ 20 Jul → 02 Aoû        │   4   │   23   │    6    │ Portail Parent base
  11    │ 03 Aoû → 16 Aoû        │   4   │   22   │    5    │ RH Enseignants + Tests + CI
  12    │ 17 Aoû → 30 Aoû        │   4   │   23   │    6    │ Année scolaire + Stabilisation
────────┼────────────────────────┼───────┼────────┼─────────┼──────────────────────────────
  13    │ 31 Aoû → 13 Sep        │   5   │   21   │    6    │ Stripe + Portail avancé
  14    │ 14 Sep → 27 Sep        │   5   │   22   │    5    │ E2E + i18n + Performance
  15    │ 28 Sep → 11 Oct        │   5   │   20   │    6    │ Reporting + Discipline
  16    │ 12 Oct → 25 Oct        │   5   │   20   │    7    │ Infrastructure + Finalisation
────────┼────────────────────────┼───────┼────────┼─────────┼──────────────────────────────
 TOTAL  │ 16 Mar → 25 Oct        │  1-5  │  354   │   93    │ 32 semaines (8 mois)
        │       (2026)           │       │        │         │
────────┼────────────────────────┼───────┼────────┼─────────┼──────────────────────────────
BACKLOG │ Non planifié           │   —   │  ~130  │   27    │ Futur (selon retours)
────────┼────────────────────────┼───────┼────────┼─────────┼──────────────────────────────
GRAND   │                        │       │  ~484  │  120    │
TOTAL   │                        │       │        │         │
```

---

# 📅 GANTT SIMPLIFIÉ

```
2026       Mars      Avril      Mai        Juin       Juillet    Août       Sept       Oct
           ├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────┤
Phase 1    ████████████████████████
Sécurité   S1         S2         S3

Phase 2                          ██████████████████████████
Pédagogie                        S4         S5         S6

Phase 3                                                ██████████████████████████
Finance                                                S7         S8         S9

Phase 4                                                                      ██████████████████████████
Portail                                                                      S10        S11        S12

Phase 5                                                                                           ████████████████████████████████████
Enrichir                                                                                          S13        S14        S15        S16

           ├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────┤
Jalons     ▲                     ▲                                ▲                     ▲          ▲
           │                     │                                │                     │          │
           Début                 App                              Facturation           V1.0       V2.0
           projet                sécurisée                        + Comm                Prod       Complète
```

---

# 🔄 RITUELS SCRUM PAR SPRINT

```
Jour 1  (Lundi)      │ Sprint Planning (2h)
                      │  → Revue du backlog, sélection tickets, estimation
                      │  → Définir le Sprint Goal
                      │
Jours 1-10            │ Daily Standup (15 min, chaque matin)
                      │  → Qu'ai-je fait hier ?
                      │  → Que vais-je faire aujourd'hui ?
                      │  → Ai-je des blocages ?
                      │
Jour 5 (Vendredi S1)  │ Mid-Sprint Review (30 min)
                      │  → Vérifier l'avancement vs objectif
                      │  → Ajuster si nécessaire
                      │
Jour 9 (Jeudi)        │ Code Freeze
                      │  → Plus de nouvelles fonctionnalités
                      │  → Bug fixes et polish uniquement
                      │
Jour 10 (Vendredi)    │ Sprint Review (1h) + Sprint Retrospective (45 min)
                      │  → Demo des fonctionnalités terminées
                      │  → Retours stakeholders
                      │  → Ce qui a bien marché / à améliorer
                      │  → Actions d'amélioration pour le prochain sprint
```

---

# 📋 CHECKLIST DÉPLOIEMENT PAR JALON

### Jalon Phase 1 (Sprint 3) — Staging
```
[ ] Tous les endpoints protégés par auth
[ ] RBAC fonctionnel sur tous les rôles
[ ] Docker-compose fonctionne sur serveur staging
[ ] Reset password testé de bout en bout
[ ] Audit log connexions actif
[ ] Données de test seed pour chaque rôle
```

### Jalon Phase 2 (Sprint 6) — Beta interne
```
[ ] Module absences complet et testé
[ ] Emploi du temps fonctionnel avec détection conflits
[ ] Saisie notes par lot avec auto-save
[ ] Bulletins générés en masse (vérifier calculs moyennes)
[ ] Calendrier scolaire configuré
[ ] Formation utilisateurs internes
```

### Jalon Phase 4 (Sprint 12) — V1.0 Production
```
[ ] Tests backend > 80% couverture
[ ] Tests frontend composants critiques
[ ] CI/CD pipeline vert sur main
[ ] Portail parent fonctionnel
[ ] Documentation API complète
[ ] Tests de charge (100 utilisateurs simultanés)
[ ] Backup automatique configuré
[ ] SSL/HTTPS configuré
[ ] Monitoring Actuator activé
[ ] Formation utilisateurs finaux
[ ] Guide utilisateur parent
```

### Jalon Phase 5 (Sprint 16) — V2.0
```
[ ] Paiement en ligne Stripe testé en sandbox + production
[ ] i18n FR/AR/EN complet
[ ] Tests E2E verts sur tous les parcours
[ ] Performance : temps réponse < 500ms sur toutes les pages
[ ] Discipline module complet
[ ] Inventaire salles + matériel opérationnel
[ ] Backup + restauration testés
```
