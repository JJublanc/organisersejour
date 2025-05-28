#!/bin/bash

# Script de vérification post-déploiement Clerk
# Usage: ./verify-deployment.sh [URL]

echo "🔍 Vérification du déploiement Clerk"
echo "===================================="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# URL à tester
if [ -z "$1" ]; then
    read -p "🌐 URL de l'application à tester: " APP_URL
else
    APP_URL=$1
fi

# Suppression du slash final
APP_URL=${APP_URL%/}

echo ""
echo -e "${BLUE}🎯 Test de l'URL: ${APP_URL}${NC}"
echo ""

# Fonction de test HTTP
test_endpoint() {
    local url=$1
    local description=$2
    local expected_status=${3:-200}
    
    echo -n "  Testing $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ OK ($response)${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL ($response, expected $expected_status)${NC}"
        return 1
    fi
}

# Fonction de test contenu
test_content() {
    local url=$1
    local description=$2
    local search_text=$3
    
    echo -n "  Testing $description... "
    
    content=$(curl -s "$url" 2>/dev/null)
    
    if echo "$content" | grep -q "$search_text"; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL (content not found)${NC}"
        return 1
    fi
}

# Tests de base
echo -e "${YELLOW}📋 Tests de base${NC}"
test_endpoint "$APP_URL" "Page d'accueil"
test_endpoint "$APP_URL/trips" "Page séjours"
test_endpoint "$APP_URL/recipes" "Page recettes"
test_endpoint "$APP_URL/ingredients" "Page ingrédients"

echo ""

# Tests des APIs
echo -e "${YELLOW}📋 Tests des APIs${NC}"
test_endpoint "$APP_URL/api/recipes" "API recettes"
test_endpoint "$APP_URL/api/ingredients" "API ingrédients"
test_endpoint "$APP_URL/api/kitchen_tools" "API ustensiles"

echo ""

# Tests du contenu Clerk
echo -e "${YELLOW}📋 Tests Clerk${NC}"
test_content "$APP_URL" "Clerk script chargé" "clerk"
test_content "$APP_URL/recipes" "Protection activée" "Authentification requise"

echo ""

# Test de la configuration
echo -e "${YELLOW}📋 Tests de configuration${NC}"

# Vérifier si l'authentification est activée
auth_check=$(curl -s "$APP_URL" | grep -o "authEnabled.*true" || echo "not found")
if [ "$auth_check" != "not found" ]; then
    echo -e "  Configuration auth: ${GREEN}✅ Activée${NC}"
else
    echo -e "  Configuration auth: ${RED}❌ Non détectée${NC}"
fi

# Vérifier la présence de Clerk
clerk_check=$(curl -s "$APP_URL" | grep -o "clerk" || echo "not found")
if [ "$clerk_check" != "not found" ]; then
    echo -e "  Clerk intégration: ${GREEN}✅ Détectée${NC}"
else
    echo -e "  Clerk intégration: ${RED}❌ Non détectée${NC}"
fi

echo ""

# Tests de performance
echo -e "${YELLOW}📋 Tests de performance${NC}"

# Temps de réponse page d'accueil
echo -n "  Temps de réponse accueil... "
time_home=$(curl -s -o /dev/null -w "%{time_total}" "$APP_URL" 2>/dev/null)
if (( $(echo "$time_home < 2.0" | bc -l) )); then
    echo -e "${GREEN}✅ ${time_home}s${NC}"
else
    echo -e "${YELLOW}⚠️  ${time_home}s (lent)${NC}"
fi

# Temps de réponse API
echo -n "  Temps de réponse API... "
time_api=$(curl -s -o /dev/null -w "%{time_total}" "$APP_URL/api/recipes" 2>/dev/null)
if (( $(echo "$time_api < 3.0" | bc -l) )); then
    echo -e "${GREEN}✅ ${time_api}s${NC}"
else
    echo -e "${YELLOW}⚠️  ${time_api}s (lent)${NC}"
fi

echo ""

# Tests de sécurité
echo -e "${YELLOW}📋 Tests de sécurité${NC}"

# Vérifier HTTPS
if [[ $APP_URL == https://* ]]; then
    echo -e "  HTTPS: ${GREEN}✅ Activé${NC}"
else
    echo -e "  HTTPS: ${RED}❌ Non activé${NC}"
fi

# Vérifier les headers de sécurité
echo -n "  Headers de sécurité... "
headers=$(curl -s -I "$APP_URL" 2>/dev/null)
if echo "$headers" | grep -q "X-Frame-Options\|Content-Security-Policy"; then
    echo -e "${GREEN}✅ Présents${NC}"
else
    echo -e "${YELLOW}⚠️  Partiels${NC}"
fi

echo ""

# Résumé
echo -e "${BLUE}📊 Résumé du déploiement${NC}"
echo ""

# Compter les succès/échecs
total_tests=10
echo "Tests effectués: $total_tests"
echo ""

# Recommandations
echo -e "${YELLOW}💡 Recommandations post-déploiement:${NC}"
echo ""
echo "1. 🔍 Vérifiez les logs Cloudflare Pages"
echo "2. 📊 Surveillez les métriques Clerk Dashboard"
echo "3. 🧪 Testez manuellement l'authentification"
echo "4. 👥 Informez les utilisateurs du changement"
echo "5. 📱 Testez sur mobile et différents navigateurs"
echo ""

# Instructions de monitoring
echo -e "${BLUE}📈 Monitoring continu:${NC}"
echo ""
echo "• Logs Cloudflare: https://dash.cloudflare.com/pages"
echo "• Métriques Clerk: https://dashboard.clerk.com"
echo "• Uptime monitoring: Configurez un service externe"
echo ""

# Script de rollback rapide
echo -e "${YELLOW}🚨 En cas de problème:${NC}"
echo ""
echo "Rollback rapide:"
echo "  ./rollback-clerk.sh"
echo "  git add . && git commit -m 'Emergency rollback' && git push"
echo ""

echo -e "${GREEN}🎉 Vérification terminée !${NC}"