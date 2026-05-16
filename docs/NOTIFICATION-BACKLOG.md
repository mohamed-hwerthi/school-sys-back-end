# 📨 Backlog — Moteur de Notifications (`NOTIF`)

> **Statut** : Proposé · **Créé le** : 2026-05-16
> **Périmètre** : module transverse — backend Spring Boot + app web React + app mobile + site vitrine généré.

## 1. Objectif

Remplacer la logique de notification éparpillée par **un module unique et centralisé** :

- **Multi-canal** : in-app, email, SMS, push mobile, web push.
- **Multi-tenant** : isolation par école.
- **Multi-app** : consommé par l'app web, l'app mobile et le site vitrine généré.

## 2. Constat de l'existant

- Logique dispersée : `AbsenceNotificationService`, `DisciplineNotificationService`… chaque domaine envoie « à sa façon ».
- `EmailService` existe (package `auth`). Intégration SMS existe (badge « 4035 SMS »).
- Front : hook `useNotificationsRealtime`, page `Notifications`, cloche navbar **codée en dur (« 3 »)**.
- ❌ Pas de modèle de données unifié, pas de préférences, pas de templates, pas de suivi de livraison.

## 3. Décisions à trancher avant de démarrer

1. **Stockage** : notifications dans le schéma `public` (les `users` y sont) ou par tenant ?
2. **Temps réel** : WebSocket (bidirectionnel) ou SSE (plus simple, suffisant ici) ?
3. **Push mobile** : Firebase Cloud Messaging (recommandé — gère Android + iOS) ?
4. **File d'attente** : outbox pattern en base (simple, pas d'infra) ou broker dédié (RabbitMQ/Kafka) ?
5. **SMS** : quel provider, et le « crédit SMS » est-il déjà modélisé en base ?

## 4. Épics & Stories

Priorités : **P1** = MVP / indispensable · **P2** = important · **P3** = amélioration.

### EPIC 0 — Fondations & architecture
| ID | P | Story |
|----|----|-------|
| NOTIF-001 | P1 | Modèle de domaine : entités `Notification`, `NotificationDelivery` (1 par destinataire×canal), `NotificationTemplate`, `NotificationPreference` ; enums `Channel`, `EventType`, `DeliveryStatus`. |
| NOTIF-002 | P1 | Décision multi-tenant : schéma `public` ou par tenant → trancher + migrations Flyway. |
| NOTIF-003 | P1 | Catalogue d'événements : recenser tous les déclencheurs (absence, retard, note/bulletin publié, paiement dû, relance, message, incident/sanction, réunion, devoir, circulaire, inscription…). |
| NOTIF-004 | P1 | API noyau : point d'entrée unique `NotificationService.dispatch(eventType, recipients, context)`. |
| NOTIF-005 | P1 | Abstraction `ChannelSender` (Strategy) : interface commune par canal. |

### EPIC 1 — Canal In-App (MVP)
| ID | P | Story |
|----|----|-------|
| NOTIF-010 | P1 | Persistance in-app + statut lu/non-lu. |
| NOTIF-011 | P1 | API REST : `GET /notifications` (paginé/filtré), `GET /unread-count`, `PUT /{id}/read`, `PUT /read-all`, `DELETE /{id}`. |
| NOTIF-012 | P1 | Sécurité : un utilisateur ne voit **que ses** notifications ; isolation tenant. |

### EPIC 2 — Temps réel & multi-app
| ID | P | Story |
|----|----|-------|
| NOTIF-020 | P1 | Push temps réel app web (WebSocket ou SSE) → brancher `useNotificationsRealtime`. |
| NOTIF-021 | P2 | Enregistrement des devices mobiles : table `device_tokens`, endpoints register/unregister. |
| NOTIF-022 | P2 | Canal Push mobile (Firebase Cloud Messaging — Android/iOS). |
| NOTIF-023 | P3 | Web Push navigateur (service worker + VAPID). |
| NOTIF-024 | P2 | Contrat d'API unifié documenté pour les 3 consommateurs (web / mobile / vitrine). |

### EPIC 3 — Canaux Email & SMS
| ID | P | Story |
|----|----|-------|
| NOTIF-030 | P2 | Canal Email : brancher l'`EmailService` existant au moteur, emails HTML. |
| NOTIF-031 | P2 | Canal SMS : brancher le provider SMS + suivi du **crédit SMS par tenant**. |
| NOTIF-032 | P2 | Fallback multi-canal (push échoué → email, etc.). |

### EPIC 4 — Templates & i18n
| ID | P | Story |
|----|----|-------|
| NOTIF-040 | P2 | Moteur de templates : par `EventType` × canal × langue (**FR / AR**). |
| NOTIF-041 | P2 | Interpolation de variables + rendu. |
| NOTIF-042 | P3 | UI admin de gestion des templates. |
| NOTIF-043 | P2 | Support RTL / arabe dans emails & SMS. |

### EPIC 5 — Préférences & routage
| ID | P | Story |
|----|----|-------|
| NOTIF-050 | P2 | Préférences utilisateur : par événement × canal (opt-in/opt-out). |
| NOTIF-051 | P3 | Heures calmes / Ne pas déranger. |
| NOTIF-052 | P2 | Politiques par tenant (canaux activés, défauts). |
| NOTIF-053 | P1 | Règles de routage par rôle (ex : parent → absence de son enfant ; prof → ses classes). |
| NOTIF-054 | P3 | UI préférences (web + mobile). |

### EPIC 6 — Fiabilité & asynchrone
| ID | P | Story |
|----|----|-------|
| NOTIF-060 | P1 | Dispatch asynchrone (outbox pattern / `@Async`) : ne pas bloquer les requêtes métier. |
| NOTIF-061 | P1 | Suivi de livraison : statuts `PENDING/SENT/DELIVERED/FAILED/READ` par canal. |
| NOTIF-062 | P2 | Retries + backoff + dead-letter. |
| NOTIF-063 | P3 | Digest / regroupement (résumé quotidien). |
| NOTIF-064 | P3 | Rate limiting / anti-spam. |

### EPIC 7 — Migration de l'existant
| ID | P | Story |
|----|----|-------|
| NOTIF-070 | P1 | Migrer `AbsenceNotificationService` vers le moteur. |
| NOTIF-071 | P2 | Migrer `DisciplineNotificationService`. |
| NOTIF-072 | P2 | Recenser & migrer les autres déclencheurs (relances finance, messagerie, bulletins, réunions…). |
| NOTIF-073 | P1 | Brancher la **cloche du navbar** sur les vraies données (fin du « 3 » codé en dur). |

### EPIC 8 — Admin & observabilité
| ID | P | Story |
|----|----|-------|
| NOTIF-080 | P2 | Journal / audit des notifications (qui, quoi, quand, statut). |
| NOTIF-081 | P3 | Dashboard admin (volumes, taux livraison/échec par canal). |
| NOTIF-082 | P3 | Renvoi manuel d'une notification échouée. |
| NOTIF-083 | P3 | Métriques & alerting (échecs canal, crédit SMS bas). |
| NOTIF-084 | P2 | Rétention / purge (RGPD). |

### EPIC 9 — Qualité
| ID | P | Story |
|----|----|-------|
| NOTIF-090 | P1 | Tests unit/intégration (moteur + canaux mockés). |
| NOTIF-091 | P2 | Tests E2E par consommateur (web, mobile). |
| NOTIF-092 | P2 | Doc : catalogue d'événements + guide « ajouter un événement / un canal ». |

## 5. Découpage en phases

| Phase | Contenu | Résultat |
|-------|---------|----------|
| **1 — MVP** | EPIC 0, EPIC 1, NOTIF-020, NOTIF-053, NOTIF-060/061, NOTIF-070, NOTIF-073, NOTIF-090 | Notifications **in-app temps réel** de bout en bout sur l'app web ; absences migrées ; cloche réelle |
| **2 — Multi-canal** | EPIC 3 (email/SMS), EPIC 4 (templates/i18n), EPIC 5 (préférences), NOTIF-024, NOTIF-071/072 | Email + SMS + préférences + tous les déclencheurs migrés |
| **3 — Mobile & robustesse** | NOTIF-021/022 (push mobile), EPIC 6 (retries/digest), EPIC 8 (admin) | App mobile notifiée ; fiabilité ; supervision |
| **4 — Finitions** | NOTIF-023 (web push), NOTIF-081/082/083, reste EPIC 9 | Couverture complète |
