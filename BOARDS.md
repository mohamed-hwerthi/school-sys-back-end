# 📋 School Management System — Project Boards

> **Last Updated**: 2026-03-11
> **Methodology**: Agile Scrum — 2-week sprints
> **Legend**: 🔴 Bloquant | 🟠 Haute | 🟡 Moyenne | 🟢 Basse | ⚪ Future

---

---

## 🔐 BOARD 1 : Authentification & Sécurité

> **Owner**: Backend Lead | **Sprint**: 1–3 | **Priorité Globale**: 🔴 CRITIQUE

| 📥 À Faire (To Do) | 🔄 En Cours (In Progress) | 👀 En Revue (Review) | ✅ Terminé (Done) |
|---------------------|---------------------------|----------------------|-------------------|
| 🔴 **SEC-001** Implémenter JWT (access + refresh tokens) | | | |
| 🔴 **SEC-002** Page de login (email/password) | | | |
| 🔴 **SEC-003** Endpoint POST /auth/login | | | |
| 🔴 **SEC-004** Endpoint POST /auth/logout | | | |
| 🔴 **SEC-005** Endpoint POST /auth/refresh-token | | | |
| 🔴 **SEC-006** Guard routes frontend (PrivateRoute) | | | |
| 🔴 **SEC-007** Définir les rôles (SUPER_ADMIN, ADMIN, DIRECTEUR, ENSEIGNANT, COMPTABLE, PARENT) | | | |
| 🔴 **SEC-008** Table users + roles + permissions (migration Flyway) | | | |
| 🔴 **SEC-009** CRUD Utilisateurs (admin panel) | | | |
| 🔴 **SEC-010** Matrice permissions par rôle | | | |
| 🔴 **SEC-011** @PreAuthorize sur tous les controllers existants | | | |
| 🔴 **SEC-012** Menus conditionnels selon rôle (sidebar) | | | |
| 🟠 **SEC-013** Reset password (email link) | | | |
| 🟠 **SEC-014** Verrouillage compte après 5 échecs | | | |
| 🟠 **SEC-015** Journal des connexions (audit log) | | | |
| 🟡 **SEC-016** 2FA (TOTP authenticator) | | | |
| 🟡 **SEC-017** Gestion sessions multi-appareils | | | |
| 🟡 **SEC-018** Page 403 Forbidden | | | |

> **Durcissement & intégration du moteur d'auth** — le moteur (JWT, rôles, 2FA, sessions) est en place ; ces tickets le finissent, le sécurisent et le câblent dans les actions métier (audit SEC-028).

| 📥 À Faire (To Do) | 🔄 En Cours (In Progress) | 👀 En Revue (Review) | ✅ Terminé (Done) |
|---------------------|---------------------------|----------------------|-------------------|
| 🔴 **SEC-019** Hotfix : `@PreAuthorize` cassés (MANAGE_FINANCE ×4, VitrineAdmin, MANAGE_MEETINGS) | | | |
| 🟠 **SEC-020** Journal des connexions (login OK/échec/lockout → AuditLog) | | | |
| 🟠 **SEC-021** Fail-fast si `JWT_SECRET` absent en profil prod | | | |
| 🟠 **SEC-022** Rate-limiting sur `/api/auth/**` (anti brute-force) | | | |
| 🟠 **SEC-023** Résolution tenant ↔ utilisateur au login (claim + cohérence) | | | |
| 🟡 **SEC-024** Invalidation access-token au logout (blacklist courte durée) | | | |
| 🟠 **SEC-025** Audit `createdBy`/`updatedBy` sur les entités métier | | | |
| 🟠 **SEC-026** Audit fonctionnel des actions sensibles (notes, finance, rôles) | | | |
| 🔴 **SEC-027** Compléter le scoping ligne-par-ligne (IDOR Messaging/Meeting/Soumission) | | | |
| 🟠 **SEC-028** Auditer & aligner la matrice `@PreAuthorize` + test garde-fou | | | |
| 🟠 **SEC-029** Lier comptes PARENT/ENSEIGNANT aux entités métier | | | |
| 🟡 **SEC-030** Audit du `PermissionGuard` sur toutes les routes front | | | |
| 🟡 **SEC-031** Refresh token silencieux + file d'attente (web) | | | |
| 🟡 **SEC-032** Pages 401/403 + écrans 2FA / reset password | | | |
| 🟢 **SEC-033** Déverrouillage biométrique mobile (expo-local-authentication) | | | |
| 🟡 **SEC-034** Mobile : expiration refresh → déconnexion forcée propre | | | |
| 🟠 **SEC-035** Tests d'intégration sécurité (403, scoping, lockout, rotation) | | | |
| 🟢 **SEC-036** Mettre à jour CLAUDE.md + documentation auth | | | |
| 🟡 **SEC-037** Seeds users de démo (1 par rôle) | | | |

### Détails des Tâches Techniques

```
SEC-001 : JWT Implementation
├── Dépendance Maven : spring-boot-starter-oauth2-resource-server, jjwt
├── JwtTokenProvider.java (génération, validation, extraction claims)
├── JwtAuthenticationFilter.java (OncePerRequestFilter)
├── SecurityConfig.java (remplacer .permitAll() par .authenticated())
├── Access token : expiration 15min
├── Refresh token : expiration 7 jours, stocké en DB
└── Estimation : 5 story points

SEC-007 : Rôles & Permissions
├── Enum Role : SUPER_ADMIN, ADMIN, DIRECTEUR, ENSEIGNANT, COMPTABLE, PARENT
├── Enum Permission : READ_STUDENTS, WRITE_STUDENTS, READ_NOTES, WRITE_NOTES...
├── Table : users (id, email, password_hash, role, is_active, tenant_id)
├── Table : role_permissions (role, permission)
└── Estimation : 8 story points
```

### Détails Durcissement Auth (SEC-019 → SEC-037)

```
SEC-019 : Hotfix @PreAuthorize cassés                        [🔴 2 pts]
├── BUG : hasAuthority('MANAGE_FINANCE') — permission absente de l'enum
│         → BourseController, BudgetController, AuditFinancierController,
│           ExportComptableController = 403 pour TOUS (même SUPER_ADMIN)
├── BUG : VitrineAdminController hasAnyAuthority('ADMIN','DIRECTEUR',
│         'MANAGE_VITRINE') — rôles non préfixés ROLE_ + perm absente
│         → admin vitrine = 403 pour tous
├── BUG : MeetingController hasAnyAuthority('MANAGE_SYSTEM','MANAGE_MEETINGS')
│         — MANAGE_MEETINGS absent (dégradé, marche via MANAGE_SYSTEM)
└── FIX : remplacer par permissions réelles (MANAGE_FACTURES / READ_AUDIT,
          hasAnyRole(...), nouvelle perm MANAGE_VITRINE/MANAGE_MEETINGS si besoin)

SEC-020 : Journal des connexions                             [🟠 3 pts]
├── AuthService → appel AuditService sur login OK / échec / lockout
└── Champs : userId, email, IP, user-agent, résultat, timestamp

SEC-021 : Fail-fast JWT_SECRET en prod                       [🟠 2 pts]
├── application-prod.yml : secret = ${JWT_SECRET:} (vide par défaut)
└── @PostConstruct / EnvironmentPostProcessor : abort si vide en profil prod

SEC-022 : Rate-limiting /api/auth/**                         [🟠 3 pts]
├── Bucket4j ou filtre maison : limite par IP sur login + forgot-password
└── Complète le lockout par compte (anti brute-force distribué)

SEC-023 : Tenant ↔ utilisateur au login                     [🟠 3 pts]
├── Vérifier qu'un user ne s'authentifie que sur son schéma
└── Claim 'tenant' dans le JWT, cohérence avec header X-Tenant-ID

SEC-024 : Invalidation access-token au logout                [🟡 2 pts]
└── Cache courte durée (jti blacklist) — ou décision documentée d'accepter
    la fenêtre de 15 min

SEC-025 : Audit createdBy / updatedBy                        [🟠 5 pts]
├── Spring Data Auditing : @CreatedBy / @LastModifiedBy
└── AuditorAware branché sur CurrentUserContext

SEC-026 : Audit fonctionnel actions sensibles                [🟠 5 pts]
├── Suppressions, modif notes/bulletins/finance, changement de rôle
└── Entrée AuditLog, consultable via AuditController

SEC-027 : Scoping ligne-par-ligne complet                    [🔴 5 pts]
├── IDOR MessagingService : inbox/sent/markAsRead par {recipientId} d'URL
│   sans contrôle = lecture mail d'autrui → forcer = user courant
├── MeetingService : /parent/{id} /student/{id} /teacher/{id} non scopés
├── SoumissionService / EmpruntService / PointageRepasService : by-{eleveId}
├── EmploiDuTempsService : /enseignant/{id} → autre prof
└── TenantController GET list/{id} : aucun @PreAuthorize → ajouter MANAGE_TENANTS

SEC-028 : Audit & garde-fou matrice @PreAuthorize            [🟠 3 pts]
├── Aligner chaque @PreAuthorize sur RolePermissions (source unique)
├── Uniformiser hasAnyRole vs hasAuthority (classroom/domaine/module/niveau)
└── Test : toute chaîne d'un @PreAuthorize = Permission ou UserRole réel

SEC-029 : Liaison comptes PARENT/ENSEIGNANT                  [🟠 3 pts]
└── À la création parent/enseignant : créer le User + lien
    (ParentStudent, Teacher.email) sinon le scoping est vide

SEC-030 : Audit PermissionGuard front                        [🟡 3 pts]
SEC-031 : Refresh silencieux + file d'attente (web)          [🟡 2 pts]
SEC-032 : Pages 401/403 + écrans 2FA / reset                 [🟡 2 pts]
SEC-033 : Déverrouillage biométrique mobile                  [🟢 3 pts]
SEC-034 : Mobile — expiration refresh → logout propre        [🟡 2 pts]
SEC-035 : Tests d'intégration sécurité                       [🟠 5 pts]
SEC-036 : MAJ CLAUDE.md + doc auth                           [🟢 2 pts]
SEC-037 : Seeds users de démo (1 par rôle)                   [🟡 2 pts]
```

---

---

## 👨‍🎓 BOARD 2 : Gestion des Élèves

> **Owner**: Fullstack Dev | **Sprint**: 4–6 | **Priorité Globale**: 🔴 / 🟠

| 📥 À Faire (To Do) | 🔄 En Cours (In Progress) | 👀 En Revue (Review) | ✅ Terminé (Done) |
|---------------------|---------------------------|----------------------|-------------------|
| | | | ✅ **ELV-001** CRUD élèves (infos personnelles) |
| | | | ✅ **ELV-002** Filtrage par nom, niveau, classe, statut |
| | | | ✅ **ELV-003** Pagination et tri côté serveur |
| | | | ✅ **ELV-004** Gestion statut (Actif/Inactif/Bloqué) |
| | | | ✅ **ELV-005** Import Excel basique |
| 🔴 **ELV-006** Workflow inscription multi-étapes | | | |
| 🟠 **ELV-007** Upload documents élève (photo, certificats) | | | |
| 🟠 **ELV-008** Génération matricule unique auto | | | |
| 🟠 **ELV-009** Réinscription en masse (annuelle) | | | |
| 🟠 **ELV-010** Template Excel + validation import | | | |
| 🟡 **ELV-011** Pré-inscription en ligne (parents) | | | |
| 🟡 **ELV-012** Fiche élève PDF complète | | | |

### Sous-Board 2.1 : Présence & Absences

| 📥 À Faire (To Do) | 🔄 En Cours (In Progress) | 👀 En Revue (Review) | ✅ Terminé (Done) |
|---------------------|---------------------------|----------------------|-------------------|
| 🔴 **ABS-001** Table absences (migration Flyway V12) | | | |
| 🔴 **ABS-002** API CRUD absences (AbsenceController) | | | |
| 🔴 **ABS-003** Page appel par classe/séance | | | |
| 🔴 **ABS-004** Dashboard absences (stats, graphiques) | | | |
| 🟠 **ABS-005** Notification SMS/email parents | | | |
| 🟠 **ABS-006** Configuration seuils d'alerte | | | |
| 🟠 **ABS-007** Rapport mensuel présence (PDF/Excel) | | | |
| 🟡 **ABS-008** Justification absence en ligne (parent) | | | |
| 🟡 **ABS-009** Historique présence par élève | | | |

```
ABS-001 : Migration Flyway
├── Table : absences (id, eleve_id, date, type[ABSENCE/RETARD], justifie, motif, seance, enseignant_id)
├── Table : justificatifs (id, absence_id, fichier_url, date_soumission, valide)
└── Estimation : 2 story points

ABS-003 : Page Appel
├── Sélecteur : Date + Classe + Séance (matin/après-midi/séance spécifique)
├── Liste élèves avec toggle : ✅ Présent | ❌ Absent | ⏰ Retard
├── Champ heure arrivée si retard
├── Bouton "Valider l'appel" → POST /api/absences/batch
├── React Hook Form + Zod validation
└── Estimation : 8 story points
```

### Sous-Board 2.2 : Discipline

| 📥 À Faire (To Do) | 🔄 En Cours (In Progress) | 👀 En Revue (Review) | ✅ Terminé (Done) |
|---------------------|---------------------------|----------------------|-------------------|
| 🟠 **DISC-001** Table incidents + sanctions (Flyway) | | | |
| 🟠 **DISC-002** API incidents disciplinaires | | | |
| 🟠 **DISC-003** Formulaire signalement incident | | | |
| 🟠 **DISC-004** Workflow sanction (avertissement → blâme → exclusion) | | | |
| 🟡 **DISC-005** Historique disciplinaire (timeline) | | | |
| 🟡 **DISC-006** Notification parent incident | | | |

---

---

## 📚 BOARD 3 : Gestion Pédagogique

> **Owner**: Fullstack Dev | **Sprint**: 4–8 | **Priorité Globale**: 🔴 / 🟠

### Sous-Board 3.1 : Emploi du Temps

| 📥 À Faire (To Do) | 🔄 En Cours (In Progress) | 👀 En Revue (Review) | ✅ Terminé (Done) |
|---------------------|---------------------------|----------------------|-------------------|
| | | | ✅ **EDT-000** Emploi des salles (basique) |
| 🔴 **EDT-001** Table emploi_du_temps (Flyway) | | | |
| 🔴 **EDT-002** API CRUD créneaux horaires | | | |
| 🔴 **EDT-003** Page création EDT (grille hebdo, drag & drop) | | | |
| 🔴 **EDT-004** Détection conflits (enseignant/salle) | | | |
| 🟠 **EDT-005** Vue EDT enseignant personnel | | | |
| 🟠 **EDT-006** Gestion remplacements | | | |
| 🟡 **EDT-007** Vue EDT parent/élève (lecture seule) | | | |
| 🟡 **EDT-008** Export EDT en PDF | | | |

```
EDT-001 : Migration Flyway
├── Table : creneaux (id, jour_semaine, heure_debut, heure_fin, label)
├── Table : emploi_du_temps (id, classe_id, creneau_id, module_id, enseignant_id, salle_id)
├── Contraintes UNIQUE : (enseignant_id, creneau_id, jour), (salle_id, creneau_id, jour)
└── Estimation : 3 story points

EDT-003 : Page Création EDT
├── Sélecteur classe en haut
├── Grille : colonnes = jours (Lun-Sam), lignes = créneaux
├── Drag & drop depuis panel modules/enseignants
├── Coloration par domaine (Arabe=vert, Français=bleu, Sciences=orange...)
├── Alertes temps réel si conflit
├── Lib recommandée : @dnd-kit/core ou react-beautiful-dnd
└── Estimation : 13 story points
```

### Sous-Board 3.2 : Notes & Évaluations

| 📥 À Faire (To Do) | 🔄 En Cours (In Progress) | 👀 En Revue (Review) | ✅ Terminé (Done) |
|---------------------|---------------------------|----------------------|-------------------|
| | | | ✅ **NOT-001** CRUD examens |
| | | | ✅ **NOT-002** Saisie notes par examen |
| | | | ✅ **NOT-003** Calcul moyennes par module |
| | | | ✅ **NOT-004** Appréciations enseignant |
| 🔴 **NOT-005** Saisie notes par lot (grille rapide + auto-save) | | | |
| 🔴 **NOT-006** Moyennes pondérées domaine/sous-domaine | | | |
| 🟠 **NOT-007** Barème de notation configurable | | | |
| 🟠 **NOT-008** Verrouillage saisie après date limite | | | |
| 🟡 **NOT-009** Évaluation par compétences | | | |
| 🟡 **NOT-010** Consultation notes (portail parent) | | | |

### Sous-Board 3.3 : Bulletins

| 📥 À Faire (To Do) | 🔄 En Cours (In Progress) | 👀 En Revue (Review) | ✅ Terminé (Done) |
|---------------------|---------------------------|----------------------|-------------------|
| | | | ✅ **BUL-001** Génération bulletin individuel PDF |
| | | | ✅ **BUL-002** Calcul moyennes par domaine |
| 🔴 **BUL-003** Template bulletin personnalisable (logo, en-tête AR/FR) | | | |
| 🔴 **BUL-004** Génération bulletins en masse (par classe) + ZIP | | | |
| 🟠 **BUL-005** Stats réussite par classe/module (histogrammes) | | | |
| 🟠 **BUL-006** Attestation de scolarité (template + QR code) | | | |
| 🟡 **BUL-007** Comparatif performances inter-classes/trimestres | | | |

---

---

## 💰 BOARD 4 : Gestion Financière

> **Owner**: Backend Lead + Fullstack | **Sprint**: 7–9 | **Priorité Globale**: 🔴 / 🟠

| 📥 À Faire (To Do) | 🔄 En Cours (In Progress) | 👀 En Revue (Review) | ✅ Terminé (Done) |
|---------------------|---------------------------|----------------------|-------------------|
| | | | ✅ **FIN-001** Types de frais (CRUD) |
| | | | ✅ **FIN-002** Paiements (CRUD + statuts) |
| | | | ✅ **FIN-003** Remises/réductions |
| | | | ✅ **FIN-004** Pénalités de retard |
| | | | ✅ **FIN-005** Relances (email/SMS/courrier) |
| | | | ✅ **FIN-006** Dépenses par catégorie |
| | | | ✅ **FIN-007** Caisse (ouverture/fermeture) |
| | | | ✅ **FIN-008** Mouvements de caisse |
| | | | ✅ **FIN-009** Rapport trésorerie basique |
| 🔴 **FIN-010** Génération factures PDF (numérotation séquentielle) | | | |
| 🔴 **FIN-011** Reçu de paiement PDF | | | |
| 🔴 **FIN-012** Échéanciers de paiement (N mensualités) | | | |
| 🟠 **FIN-013** Envoi factures par email | | | |
| 🟠 **FIN-014** Escalade automatique impayés (J+7, J+15, J+30) | | | |
| 🟠 **FIN-015** Bilan financier annuel (PDF/Excel) | | | |
| 🟡 **FIN-016** Intégration Stripe (paiement en ligne) | | | |
| 🟡 **FIN-017** Webhook réconciliation auto | | | |
| 🟡 **FIN-018** Portail paiement parent | | | |
| 🟡 **FIN-019** Rapprochement bancaire (import CSV) | | | |
| 🟡 **FIN-020** Gestion paie enseignants | | | |

```
FIN-010 : Factures PDF
├── Template : En-tête école (logo, nom FR/AR, adresse)
├── Infos élève : Nom, classe, matricule
├── Détail : Type frais, montant, remise, net à payer
├── Numérotation : FAC-2026-00001 (auto-incrémenté)
├── Footer : conditions de paiement, coordonnées bancaires
├── Lib : JasperReports ou iText (backend) / jsPDF existant (frontend)
└── Estimation : 5 story points

FIN-012 : Échéanciers
├── À l'inscription : choix nombre de mensualités (1, 3, 6, 10)
├── Calcul automatique des dates d'échéance
├── Suivi par échéance : PAYÉ / EN ATTENTE / EN RETARD
├── Alerte automatique 3 jours avant échéance
└── Estimation : 8 story points
```

---

---

## 📨 BOARD 5 : Communication & Notifications

> **Owner**: Fullstack Dev | **Sprint**: 7–9 | **Priorité Globale**: 🟠

| 📥 À Faire (To Do) | 🔄 En Cours (In Progress) | 👀 En Revue (Review) | ✅ Terminé (Done) |
|---------------------|---------------------------|----------------------|-------------------|
| 🟠 **COM-001** Messagerie interne (backend : messages table + API) | | | |
| 🟠 **COM-002** UI Boîte de réception (inbox, envoyés, brouillons) | | | |
| 🟠 **COM-003** Circulaires (envoi groupé par classe/niveau/école) | | | |
| 🟠 **COM-004** WebSocket setup (Spring WebSocket + SockJS + STOMP) | | | |
| 🟠 **COM-005** Notifications temps réel (badge, dropdown, son) | | | |
| 🟠 **COM-006** Intégration email (SendGrid/SMTP) | | | |
| 🟠 **COM-007** Intégration SMS (Twilio/Vonage) | | | |
| 🟠 **COM-008** Templates notifications configurables | | | |
| 🟡 **COM-009** Préférences notification par utilisateur | | | |
| 🟡 **COM-010** Fil de discussion parent-enseignant par élève | | | |
| 🟡 **COM-011** Suivi lecture circulaires (accusé) | | | |

```
COM-004 : WebSocket
├── Backend : spring-boot-starter-websocket
├── Config : WebSocketConfig.java (STOMP over SockJS)
├── Endpoint : /ws
├── Topics : /topic/notifications/{userId}
├── Frontend : @stomp/stompjs + sockjs-client
├── NotificationProvider (React Context) → global state
└── Estimation : 8 story points

COM-006 : Email Integration
├── Dépendance : spring-boot-starter-mail
├── Service : EmailService.java (async @Async)
├── Templates : Thymeleaf HTML templates
├── Types : facture, relance, absence, circulaire, reset password
├── Config : application.yml (SMTP host, port, credentials)
└── Estimation : 5 story points
```

---

---

## 👨‍👩‍👧 BOARD 6 : Portail Parent

> **Owner**: Frontend Lead | **Sprint**: 10–12 | **Priorité Globale**: 🟠 / 🟡

| 📥 À Faire (To Do) | 🔄 En Cours (In Progress) | 👀 En Revue (Review) | ✅ Terminé (Done) |
|---------------------|---------------------------|----------------------|-------------------|
| 🟠 **PAR-001** Layout portail parent (sidebar, header, routing séparé) | | | |
| 🟠 **PAR-002** Login parent (credentials envoyés par email à l'inscription) | | | |
| 🟠 **PAR-003** Dashboard parent (résumé enfant) | | | |
| 🟠 **PAR-004** Fiche profil enfant (lecture seule) | | | |
| 🟠 **PAR-005** Consultation notes & bulletins | | | |
| 🟡 **PAR-006** Consultation absences + justification en ligne | | | |
| 🟡 **PAR-007** Emploi du temps classe (lecture seule) | | | |
| 🟡 **PAR-008** Factures & historique paiements | | | |
| 🟡 **PAR-009** Circulaires reçues | | | |
| 🟡 **PAR-010** Messagerie avec enseignants | | | |
| 🟡 **PAR-011** Paiement en ligne (si Stripe activé) | | | |

```
PAR-001 : Layout Portail
├── Route prefix : /parent/*
├── Sidebar : Accueil, Mon Enfant, Notes, Absences, Emploi du Temps, Paiements, Messages
├── Header : Nom parent, photo enfant, notifications
├── Guard : role === 'PARENT' uniquement
├── Si parent a plusieurs enfants → sélecteur enfant
└── Estimation : 5 story points
```

---

---

## 👨‍🏫 BOARD 7 : Gestion des Enseignants

> **Owner**: Backend Dev | **Sprint**: 10–12 | **Priorité Globale**: 🟠

| 📥 À Faire (To Do) | 🔄 En Cours (In Progress) | 👀 En Revue (Review) | ✅ Terminé (Done) |
|---------------------|---------------------------|----------------------|-------------------|
| | | | ✅ **ENS-001** CRUD enseignants |
| | | | ✅ **ENS-002** Affectation classes/modules |
| 🟠 **ENS-003** Contrats enseignants (type, dates, renouvellement) | | | |
| 🟠 **ENS-004** Suivi absences enseignants (congés, maladie) | | | |
| 🟡 **ENS-005** Demande de congé (workflow approbation) | | | |
| 🟢 **ENS-006** Évaluation performance annuelle | | | |
| 🟢 **ENS-007** Catalogue formations continues | | | |

```
ENS-003 : Contrats
├── Table : contrats_enseignant (id, enseignant_id, type[CDI/CDD/VACATAIRE],
│   date_debut, date_fin, salaire_base, document_url)
├── Alertes : expiration contrat dans 30 jours
├── Historique des contrats par enseignant
└── Estimation : 5 story points
```

---

---

## 🏫 BOARD 8 : Infrastructure & Logistique

> **Owner**: Fullstack Dev | **Sprint**: 13+ | **Priorité Globale**: 🟡 / 🟢

| 📥 À Faire (To Do) | 🔄 En Cours (In Progress) | 👀 En Revue (Review) | ✅ Terminé (Done) |
|---------------------|---------------------------|----------------------|-------------------|
| 🟡 **INF-001** Inventaire salles (capacité, équipements, dispo) | | | |
| 🟡 **INF-002** Matériel pédagogique (inventaire, affectation, état) | | | |
| 🟢 **INF-003** Bibliothèque (catalogue, emprunts, retours, amendes) | | | |
| 🟢 **INF-004** Cantine (menus, inscriptions, allergies, paiements) | | | |
| 🟢 **INF-005** Transport scolaire (lignes, arrêts, élèves, chauffeurs) | | | |

---

---

## 📊 BOARD 9 : Reporting & Analytics

> **Owner**: Fullstack Dev | **Sprint**: 10–12 | **Priorité Globale**: 🟠 / 🟡

| 📥 À Faire (To Do) | 🔄 En Cours (In Progress) | 👀 En Revue (Review) | ✅ Terminé (Done) |
|---------------------|---------------------------|----------------------|-------------------|
| | | | ✅ **RPT-001** Dashboard KPIs basique |
| | | | ✅ **RPT-002** Graphiques effectifs & finances |
| 🔴 **RPT-003** Dashboard exécutif (KPIs temps réel enrichis) | | | |
| 🟡 **RPT-004** Constructeur rapports personnalisables | | | |
| 🟡 **RPT-005** Comparatifs année/année (tendances 3-5 ans) | | | |
| 🟡 **RPT-006** Rapports réglementaires (format ministériel) | | | |
| 🟡 **RPT-007** Alertes intelligentes (baisse notes, absences, impayés) | | | |

```
RPT-003 : Dashboard Exécutif
├── KPIs : Effectif total, taux présence, moyenne générale, taux recouvrement
├── Widgets :
│   ├── Camembert répartition élèves par niveau
│   ├── Courbe évolution inscriptions (mensuel)
│   ├── Barres comparatives moyennes par classe
│   ├── Jauge taux de recouvrement financier
│   ├── Top 5 impayés
│   └── Alertes récentes (absences, incidents, échéances)
├── Filtres : Période, Niveau, Classe
├── Recharts (existant) + nouvelles visualisations
└── Estimation : 8 story points
```

---

---

## ⚙️ BOARD 10 : Multi-Tenant & Admin Système

> **Owner**: Backend Lead | **Sprint**: 1–3 (base) + continu | **Priorité Globale**: 🔴 / 🟠

| 📥 À Faire (To Do) | 🔄 En Cours (In Progress) | 👀 En Revue (Review) | ✅ Terminé (Done) |
|---------------------|---------------------------|----------------------|-------------------|
| | | | ✅ **SYS-001** Architecture schema-per-tenant |
| | | | ✅ **SYS-002** TenantContext (ThreadLocal) |
| | | | ✅ **SYS-003** Migrations Flyway par tenant |
| | | | ✅ **SYS-004** Settings école |
| 🔴 **SYS-005** CRUD tenants (provisioning auto schéma) | | | |
| 🟠 **SYS-006** Dashboard super-admin multi-écoles | | | |
| 🟠 **SYS-007** Audit trail complet (toutes actions CRUD) | | | |
| 🟠 **SYS-008** Backup automatique quotidien par tenant | | | |
| 🟡 **SYS-009** Gestion licences/abonnements (plans) | | | |
| 🟡 **SYS-010** Monitoring santé système (Actuator dashboard) | | | |

```
SYS-007 : Audit Trail
├── Table : audit_log (id, user_id, action[CREATE/UPDATE/DELETE],
│   entity_type, entity_id, old_value JSON, new_value JSON, timestamp, ip_address)
├── Implémentation : @EntityListeners(AuditListener.class) sur toutes les entités
├── Ou : Spring AOP aspect sur les services
├── UI : Page traçabilité avec filtres (user, action, entité, date)
├── Données non-modifiables (append-only)
└── Estimation : 8 story points
```

---

---

## 📅 BOARD 11 : Année Scolaire & Transitions

> **Owner**: Backend Lead | **Sprint**: 4–6 | **Priorité Globale**: 🔴

| 📥 À Faire (To Do) | 🔄 En Cours (In Progress) | 👀 En Revue (Review) | ✅ Terminé (Done) |
|---------------------|---------------------------|----------------------|-------------------|
| | | | ✅ **ANN-001** Configuration année scolaire (settings) |
| 🔴 **ANN-002** Workflow clôture année scolaire | | | |
| 🔴 **ANN-003** Configuration nouvelle année (trimestres, vacances, fériés) | | | |
| 🔴 **ANN-004** Promotion/redoublement en masse | | | |
| 🟠 **ANN-005** Affectation élèves aux nouvelles classes (auto/manuel) | | | |
| 🟠 **ANN-006** Archivage données année précédente | | | |
| 🟡 **ANN-007** Calendrier scolaire (vacances, fériés, événements) | | | |

```
ANN-002 : Clôture Année
├── Étape 1 : Vérification — tous les bulletins T3 générés ?
├── Étape 2 : Vérification — toutes les notes saisies ?
├── Étape 3 : Vérification — soldes financiers traités ?
├── Étape 4 : Validation directeur (signature numérique)
├── Étape 5 : Archivage → copie read-only des données
├── Étape 6 : Remise à zéro pour nouvelle année
├── Protection : action irréversible → confirmation double + mot de passe admin
└── Estimation : 13 story points

ANN-004 : Promotion/Redoublement
├── Règles configurables : moyenne min pour passage (ex: 10/20)
├── Vue par classe : liste élèves avec moyenne annuelle
├── Auto-suggestion : PROMU / REDOUBLANT basé sur les règles
├── Override manuel par le directeur
├── Cas spéciaux : passage conditionnel, orientation
├── Action batch : promouvoir tous les élèves validés
└── Estimation : 8 story points
```

---

---

## 🔧 BOARD 12 : Qualité & Technique

> **Owner**: Tech Lead | **Sprint**: Continu | **Priorité Globale**: 🟠

| 📥 À Faire (To Do) | 🔄 En Cours (In Progress) | 👀 En Revue (Review) | ✅ Terminé (Done) |
|---------------------|---------------------------|----------------------|-------------------|
| 🟠 **TECH-001** Tests unitaires backend (> 80% couverture) | | | |
| 🟠 **TECH-002** Tests frontend (composants & hooks critiques) | | | |
| 🟠 **TECH-003** CI/CD Pipeline (GitHub Actions) | | | |
| 🟠 **TECH-004** Documentation API OpenAPI complète | | | |
| 🟠 **TECH-005** Docker (Dockerfile front + back + docker-compose) | | | |
| 🟡 **TECH-006** Tests E2E (Playwright — parcours critiques) | | | |
| 🟡 **TECH-007** i18n (Français, Arabe RTL, Anglais) | | | |
| 🟡 **TECH-008** Performance (lazy loading, Redis cache, CDN) | | | |
| 🟢 **TECH-009** Accessibilité WCAG 2.1 AA | | | |
| 🟠 **TECH-010** Gestion des erreurs globale (ErrorBoundary front + ExceptionHandler back) | | | |

```
TECH-003 : CI/CD Pipeline
├── .github/workflows/ci.yml
├── Triggers : push main, pull_request
├── Jobs :
│   ├── backend-test : mvn test + jacoco coverage report
│   ├── frontend-test : pnpm vitest run + coverage
│   ├── lint : eslint + checkstyle
│   ├── build : mvn package + pnpm build
│   └── deploy-staging : Docker build + push + deploy
├── Environments : staging, production
├── Secrets : DB credentials, SMTP, Stripe keys
└── Estimation : 8 story points

TECH-005 : Docker
├── school-system-back/Dockerfile (multi-stage : build + runtime)
├── school-system-front/Dockerfile (build + nginx)
├── docker-compose.yml :
│   ├── app-backend (port 8080)
│   ├── app-frontend (port 80)
│   ├── postgres (port 5432, volume persistant)
│   └── redis (port 6379, optionnel)
├── docker-compose.prod.yml (overrides production)
├── .dockerignore
└── Estimation : 5 story points
```

---

---

## 📈 RÉSUMÉ GLOBAL DES BOARDS

| Board | Total Tâches | ✅ Done | 📥 To Do | Story Points Est. |
|-------|-------------|---------|----------|-------------------|
| 1 — Sécurité | 37 | 0 | 37 | ~112 |
| 2 — Élèves | 27 | 5 | 22 | ~65 |
| 3 — Pédagogie | 25 | 7 | 18 | ~70 |
| 4 — Finance | 20 | 9 | 11 | ~45 |
| 5 — Communication | 11 | 0 | 11 | ~50 |
| 6 — Portail Parent | 11 | 0 | 11 | ~40 |
| 7 — Enseignants | 7 | 2 | 5 | ~25 |
| 8 — Infrastructure | 5 | 0 | 5 | ~30 |
| 9 — Reporting | 7 | 2 | 5 | ~30 |
| 10 — Système | 10 | 4 | 6 | ~35 |
| 11 — Année Scolaire | 7 | 1 | 6 | ~40 |
| 12 — Technique | 10 | 0 | 10 | ~45 |
| **TOTAL** | **177** | **30** | **147** | **~587** |

---

## 🗓️ PLANNING SPRINTS (2 semaines chacun)

```
PHASE 1 — FONDATIONS (Sprint 1-3, 6 semaines)
┌──────────┬─────────────────────────────────────────────────────┬──────┐
│ Sprint 1 │ SEC-001→008 (JWT, Login, Users, Roles tables)      │ 21pt │
│ Sprint 2 │ SEC-009→012 (CRUD Users, Permissions, Guards)       │ 18pt │
│ Sprint 3 │ SEC-013→015, SYS-005 (Reset pwd, Lockout, Tenants) │ 16pt │
└──────────┴─────────────────────────────────────────────────────┴──────┘

PHASE 1bis — DURCISSEMENT AUTH (Sprint H1-H3, 6 semaines)
┌──────────┬─────────────────────────────────────────────────────┬──────┐
│ Sprint H1│ SEC-019→024, 028 (Hotfix + durcissement backend)    │ 18pt │
│ Sprint H2│ SEC-025→027, 029 (Intégration actions métier)       │ 18pt │
│ Sprint H3│ SEC-030→037 (Front, mobile, tests, doc)             │ 21pt │
└──────────┴─────────────────────────────────────────────────────┴──────┘

PHASE 2 — CŒUR PÉDAGOGIQUE (Sprint 4-6, 6 semaines)
┌──────────┬─────────────────────────────────────────────────────┬──────┐
│ Sprint 4 │ ABS-001→004, ANN-002 (Absences, Clôture année)     │ 23pt │
│ Sprint 5 │ EDT-001→004, ANN-003→004 (EDT, Nouvelle année)     │ 24pt │
│ Sprint 6 │ NOT-005→006, BUL-003→004, ELV-006 (Notes, Bulletins)│ 21pt │
└──────────┴─────────────────────────────────────────────────────┴──────┘

PHASE 3 — FINANCE & COMMUNICATION (Sprint 7-9, 6 semaines)
┌──────────┬─────────────────────────────────────────────────────┬──────┐
│ Sprint 7 │ FIN-010→012, COM-006→007 (Factures, Email, SMS)    │ 23pt │
│ Sprint 8 │ COM-001→005, FIN-014 (Messagerie, WebSocket, Relances)│20pt│
│ Sprint 9 │ FIN-013,015, SYS-007, TECH-005 (Bilan, Audit, Docker)│18pt│
└──────────┴─────────────────────────────────────────────────────┴──────┘

PHASE 4 — PORTAIL & ANALYTICS (Sprint 10-12, 6 semaines)
┌──────────┬─────────────────────────────────────────────────────┬──────┐
│ Sprint 10│ PAR-001→005, RPT-003 (Portail parent, Dashboard)   │ 21pt │
│ Sprint 11│ ENS-003→004, TECH-001→003 (Contrats, Tests, CI/CD) │ 21pt │
│ Sprint 12│ ANN-005→006, TECH-004,010, Bug fixes               │ 18pt │
└──────────┴─────────────────────────────────────────────────────┴──────┘

PHASE 5 — ENRICHISSEMENT (Sprint 13+)
┌──────────┬─────────────────────────────────────────────────────┬──────┐
│ Sprint 13│ PAR-006→011, FIN-016→017 (Portail complet, Stripe) │ 20pt │
│ Sprint 14│ TECH-006→008, INF-001→002 (E2E, i18n, Performance) │ 22pt │
│ Sprint 15│ RPT-004→007, COM-009→011, DISC-005→006             │ 20pt │
│ Sprint 16│ INF-003→005, ENS-005→007, TECH-009 (Biblio, A11y)  │ 18pt │
└──────────┴─────────────────────────────────────────────────────┴──────┘
```

---

## 🏷️ CONVENTION DE NOMMAGE DES TICKETS

```
Préfixe   │ Module
──────────┼──────────────────────
SEC-      │ Sécurité & Auth
ELV-      │ Élèves
ABS-      │ Absences & Présence
DISC-     │ Discipline
EDT-      │ Emploi du Temps
NOT-      │ Notes & Évaluations
BUL-      │ Bulletins & Rapports
FIN-      │ Finance
COM-      │ Communication
PAR-      │ Portail Parent
ENS-      │ Enseignants
INF-      │ Infrastructure
RPT-      │ Reporting & Analytics
SYS-      │ Système & Admin
ANN-      │ Année Scolaire
TECH-     │ Technique & Qualité
```
