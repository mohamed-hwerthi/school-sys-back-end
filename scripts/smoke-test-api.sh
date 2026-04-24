#!/usr/bin/env bash
# Smoke-test all major API endpoints with curl.
# Usage: ./scripts/smoke-test-api.sh [BASE_URL] [EMAIL] [PASSWORD] [TENANT]
set -uo pipefail

BASE="${1:-http://localhost:8082/api}"
EMAIL="${2:-directeur@school.dev}"
PASSWORD="${3:-directeur123}"
TENANT="${4:-school_1}"

GREEN=$'\e[32m'; RED=$'\e[31m'; YELLOW=$'\e[33m'; DIM=$'\e[2m'; RESET=$'\e[0m'
PASS=0; FAIL=0; SKIP=0

# ─── Login ────────────────────────────────────────────────
echo "${YELLOW}▶ Login ${EMAIL} @ ${BASE}${RESET}"
LOGIN_RES=$(curl -sS -X POST "${BASE}/auth/login" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: ${TENANT}" \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}")

TOKEN=$(echo "$LOGIN_RES" | grep -oE '"accessToken":"[^"]+"' | head -1 | sed 's/"accessToken":"//;s/"$//')

if [ -z "$TOKEN" ]; then
  echo "${RED}✗ Login failed:${RESET}"
  echo "$LOGIN_RES"
  exit 1
fi
echo "${GREEN}✓ Logged in, token length=${#TOKEN}${RESET}"
echo

AUTH="Authorization: Bearer ${TOKEN}"
TEN="X-Tenant-ID: ${TENANT}"

# ─── Helper: hit(METHOD, PATH, [BODY]) ────────────────────
hit() {
  local method=$1 path=$2 body=${3:-}
  local url="${BASE}${path}"
  local code

  if [ -n "$body" ]; then
    code=$(curl -sS -o /tmp/smoke_resp.json -w "%{http_code}" -X "$method" "$url" \
      -H "$AUTH" -H "$TEN" -H "Content-Type: application/json" -d "$body")
  else
    code=$(curl -sS -o /tmp/smoke_resp.json -w "%{http_code}" -X "$method" "$url" \
      -H "$AUTH" -H "$TEN")
  fi

  if [[ "$code" =~ ^2 ]]; then
    printf "  ${GREEN}✓${RESET} %-6s %-50s ${DIM}%s${RESET}\n" "$method" "$path" "$code"
    PASS=$((PASS+1))
  elif [[ "$code" == "404" || "$code" == "501" ]]; then
    printf "  ${YELLOW}~${RESET} %-6s %-50s ${DIM}%s (not implemented?)${RESET}\n" "$method" "$path" "$code"
    SKIP=$((SKIP+1))
  else
    printf "  ${RED}✗${RESET} %-6s %-50s ${RED}%s${RESET}\n" "$method" "$path" "$code"
    FAIL=$((FAIL+1))
    if [ -s /tmp/smoke_resp.json ]; then
      head -c 300 /tmp/smoke_resp.json | sed "s/^/    ${DIM}/;s/$/${RESET}/"
      echo
    fi
  fi
}

section() { echo; echo "${YELLOW}▶ $*${RESET}"; }

# ─── Auth / Me ────────────────────────────────────────────
section "Auth"
hit GET /auth/me

# ─── Core scolarité ───────────────────────────────────────
section "Students / Teachers / Classes / Niveaux"
hit GET  /students
hit GET  /students/paged?page=0&size=5
hit GET  /teachers
hit GET  /classes
hit GET  /niveaux
hit GET  /modules
hit GET  /domaines

section "Notes / Examens / Bulletins"
hit GET  /notes
hit GET  /examens
hit GET  /bulletins
hit GET  /bulletin-templates

section "Absences / Discipline"
hit GET  /absences
hit GET  /discipline/incidents
hit GET  /discipline/sanctions

section "Inscriptions / Enrollment"
hit GET  /inscriptions
hit GET  /inscriptions/stats

section "Finance"
hit GET  /paiements
hit GET  /depenses
hit GET  /caisse
hit GET  /factures
hit GET  /relances
hit GET  /remises

section "Communication"
hit GET  /circulaires
hit GET  /notifications
hit GET  /messages
hit GET  /meetings

section "Emploi du temps / Calendrier"
hit GET  /emploi-du-temps
hit GET  /annee-scolaire
hit GET  /vacances
hit GET  /jours-feries
hit GET  /trimestres

section "Bibliothèque / Cantine / Transport"
hit GET  /livres
hit GET  /emprunts
hit GET  /menus
hit GET  /abonnements-cantine
hit GET  /pointage-repas

section "RH / Enseignants"
hit GET  /contrats
hit GET  /conges
hit GET  /paies
hit GET  /evaluations

section "Devoirs / Quiz / Ressources"
hit GET  /devoirs
hit GET  /quiz
hit GET  /soumissions
hit GET  /ressources

section "Analytics / Rapports / Settings"
hit GET  /analytics/dashboard
hit GET  /kpi-config
hit GET  /rapports
hit GET  /settings
hit GET  /audit-logs

section "Parent Portal"
hit GET  /parent/dashboard
hit GET  /parent/children

# ─── Summary ──────────────────────────────────────────────
echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ${GREEN}PASS: ${PASS}${RESET}   ${RED}FAIL: ${FAIL}${RESET}   ${YELLOW}SKIP: ${SKIP}${RESET}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit $((FAIL > 0 ? 1 : 0))
