#!/usr/bin/env bash
# Test des APIs Finance — sidebar items :
# Paiements, Dépenses, Trésorerie, Caisse, Factures, Remises, Relances, Rapports
set -uo pipefail

BASE_URL="${BASE_URL:-http://localhost:8083}"
TENANT="${TENANT:-manarat_el_malika}"
EMAIL="${EMAIL:-ishak@gmail.com}"
PASSWORD="${PASSWORD:-123456789}"
ANNEE="${ANNEE:-2025-2026}"

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[0;33m'; BLUE='\033[0;34m'; NC='\033[0m'

PASS=0; FAIL=0; FAILED_ENDPOINTS=()

# ── Login ──────────────────────────────────────────────────────────────
echo -e "${BLUE}=== Login ${EMAIL} (tenant=${TENANT}) ===${NC}"
LOGIN_RESP=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
    -H "Content-Type: application/json" \
    -H "X-Tenant-ID: ${TENANT}" \
    -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}")

TOKEN=$(echo "$LOGIN_RESP" | grep -oP '"accessToken":"[^"]+"' | sed 's/"accessToken":"//;s/"$//')
if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Login KO${NC} → $LOGIN_RESP"
    exit 1
fi
echo -e "${GREEN}✅ Login OK${NC} (token: ${TOKEN:0:30}…)\n"

AUTH=(-H "Authorization: Bearer $TOKEN" -H "X-Tenant-ID: $TENANT")

# ── Helper ─────────────────────────────────────────────────────────────
# Args: METHOD PATH LABEL
hit() {
    local method="$1" path="$2" label="$3"
    local resp http_code body
    resp=$(curl -s -w "\n%{http_code}" -X "$method" "${BASE_URL}${path}" "${AUTH[@]}")
    http_code=$(echo "$resp" | tail -n1)
    body=$(echo "$resp" | sed '$d')

    if [[ "$http_code" =~ ^2 ]]; then
        local snippet=$(echo "$body" | head -c 120 | tr '\n' ' ')
        echo -e "  ${GREEN}✅ $http_code${NC} $method $path  ${YELLOW}→${NC} $snippet…"
        PASS=$((PASS+1))
    else
        echo -e "  ${RED}❌ $http_code${NC} $method $path"
        echo -e "      ${RED}→${NC} $(echo "$body" | head -c 200)"
        FAIL=$((FAIL+1))
        FAILED_ENDPOINTS+=("$method $path → $http_code")
    fi
}

# ── 1. Paiements ───────────────────────────────────────────────────────
echo -e "${BLUE}━━━ 1. Paiements ━━━${NC}"
hit GET "/api/paiements?page=0&size=5"                     "list"
hit GET "/api/paiements?statut=PAYE&page=0&size=5"          "filter statut"
hit GET "/api/paiements/dashboard?anneeScolaire=${ANNEE}"   "dashboard"

# ── 2. Dépenses ────────────────────────────────────────────────────────
echo -e "\n${BLUE}━━━ 2. Dépenses ━━━${NC}"
hit GET "/api/depenses?page=0&size=5"                  "list"
hit GET "/api/depenses/stats?anneeScolaire=${ANNEE}"    "stats"

# ── 3. Trésorerie ──────────────────────────────────────────────────────
echo -e "\n${BLUE}━━━ 3. Trésorerie ━━━${NC}"
hit GET "/api/tresorerie?anneeScolaire=${ANNEE}"        "résumé"

# ── 4. Caisse ──────────────────────────────────────────────────────────
echo -e "\n${BLUE}━━━ 4. Caisse ━━━${NC}"
hit GET "/api/caisse?anneeScolaire=${ANNEE}"            "list"
hit GET "/api/caisse/ouverte?anneeScolaire=${ANNEE}"    "caisse ouverte"

# ── 5. Factures ────────────────────────────────────────────────────────
echo -e "\n${BLUE}━━━ 5. Factures ━━━${NC}"
hit GET "/api/factures"                                  "list"

# ── 6. Remises ─────────────────────────────────────────────────────────
echo -e "\n${BLUE}━━━ 6. Remises ━━━${NC}"
hit GET "/api/remises?anneeScolaire=${ANNEE}"            "list"

# ── 7. Relances ────────────────────────────────────────────────────────
echo -e "\n${BLUE}━━━ 7. Relances ━━━${NC}"
hit GET "/api/relances?anneeScolaire=${ANNEE}"           "list"
hit GET "/api/relances/en-attente?anneeScolaire=${ANNEE}" "en attente"
hit GET "/api/relances/stats?anneeScolaire=${ANNEE}"     "stats"

# ── 8. Rapports Financiers ─────────────────────────────────────────────
echo -e "\n${BLUE}━━━ 8. Rapports financiers ━━━${NC}"
hit GET "/api/rapports-financiers?anneeScolaire=${ANNEE}" "rapport global"

# ── Bonus : types de frais (utilisé par Paiements UI) ──────────────────
echo -e "\n${BLUE}━━━ Bonus — Types de frais ━━━${NC}"
hit GET "/api/types-frais" "list"

# ── Summary ────────────────────────────────────────────────────────────
TOTAL=$((PASS+FAIL))
echo -e "\n${BLUE}════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ $PASS pass${NC}  /  ${RED}❌ $FAIL fail${NC}  (total: $TOTAL)"
if [ $FAIL -gt 0 ]; then
    echo -e "${RED}Échecs :${NC}"
    for e in "${FAILED_ENDPOINTS[@]}"; do echo "   • $e"; done
fi
echo -e "${BLUE}════════════════════════════════════════════${NC}"

exit $FAIL
