#!/bin/bash

# Script de test de performance pour l'authentification Clerk
# Usage: ./test-performance.sh [URL]

echo "🚀 Test de Performance - Authentification Clerk"
echo "=============================================="

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

APP_URL=${APP_URL%/}

echo ""
echo -e "${BLUE}🎯 Test de performance: ${APP_URL}${NC}"
echo ""

# Fonction de test de temps de réponse
test_response_time() {
    local url=$1
    local description=$2
    local max_time=${3:-3.0}
    
    echo -n "  Testing $description... "
    
    # Mesurer le temps de réponse
    time_total=$(curl -s -o /dev/null -w "%{time_total}" "$url" 2>/dev/null)
    time_connect=$(curl -s -o /dev/null -w "%{time_connect}" "$url" 2>/dev/null)
    time_starttransfer=$(curl -s -o /dev/null -w "%{time_starttransfer}" "$url" 2>/dev/null)
    
    # Vérifier si le temps est acceptable
    if (( $(echo "$time_total < $max_time" | bc -l) )); then
        echo -e "${GREEN}✅ ${time_total}s (connect: ${time_connect}s, TTFB: ${time_starttransfer}s)${NC}"
        return 0
    else
        echo -e "${RED}❌ ${time_total}s (trop lent, max: ${max_time}s)${NC}"
        return 1
    fi
}

# Fonction de test de taille de ressource
test_resource_size() {
    local url=$1
    local description=$2
    local max_size_kb=${3:-500}
    
    echo -n "  Testing $description size... "
    
    size_bytes=$(curl -s -o /dev/null -w "%{size_download}" "$url" 2>/dev/null)
    size_kb=$((size_bytes / 1024))
    
    if [ "$size_kb" -lt "$max_size_kb" ]; then
        echo -e "${GREEN}✅ ${size_kb}KB${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  ${size_kb}KB (large, max: ${max_size_kb}KB)${NC}"
        return 1
    fi
}

# Tests de performance de base
echo -e "${YELLOW}📋 Tests de Performance de Base${NC}"
test_response_time "$APP_URL" "Page d'accueil" 2.0
test_response_time "$APP_URL/recipes" "Page recettes" 3.0
test_response_time "$APP_URL/ingredients" "Page ingrédients" 3.0
test_response_time "$APP_URL/trips" "Page séjours" 3.0

echo ""

# Tests des APIs
echo -e "${YELLOW}📋 Tests de Performance API${NC}"
test_response_time "$APP_URL/api/recipes" "API recettes" 2.0
test_response_time "$APP_URL/api/ingredients" "API ingrédients" 2.0
test_response_time "$APP_URL/api/kitchen_tools" "API ustensiles" 2.0

echo ""

# Tests de taille des ressources
echo -e "${YELLOW}📋 Tests de Taille des Ressources${NC}"
test_resource_size "$APP_URL" "Page d'accueil" 300
test_resource_size "$APP_URL/recipes" "Page recettes" 400

echo ""

# Test de performance Clerk spécifique
echo -e "${YELLOW}📋 Tests Spécifiques Clerk${NC}"

# Vérifier la présence du preloader
echo -n "  Testing Clerk preloader... "
preloader_check=$(curl -s "$APP_URL" | grep -o "ClerkPreloader\|preload.*clerk" || echo "not found")
if [ "$preloader_check" != "not found" ]; then
    echo -e "${GREEN}✅ Détecté${NC}"
else
    echo -e "${YELLOW}⚠️  Non détecté${NC}"
fi

# Vérifier les optimisations de chargement
echo -n "  Testing loading optimizations... "
loading_check=$(curl -s "$APP_URL" | grep -o "loading-progress\|loading-spinner" || echo "not found")
if [ "$loading_check" != "not found" ]; then
    echo -e "${GREEN}✅ Interface optimisée${NC}"
else
    echo -e "${YELLOW}⚠️  Interface basique${NC}"
fi

# Test de timeout handling
echo -n "  Testing timeout handling... "
timeout_check=$(curl -s "$APP_URL" | grep -o "timeout\|Timeout" || echo "not found")
if [ "$timeout_check" != "not found" ]; then
    echo -e "${GREEN}✅ Gestion des timeouts${NC}"
else
    echo -e "${YELLOW}⚠️  Pas de gestion timeout détectée${NC}"
fi

echo ""

# Tests de performance avancés avec curl
echo -e "${YELLOW}📋 Tests de Performance Avancés${NC}"

# Test de compression
echo -n "  Testing compression... "
compressed_size=$(curl -s -H "Accept-Encoding: gzip" -o /dev/null -w "%{size_download}" "$APP_URL" 2>/dev/null)
uncompressed_size=$(curl -s -o /dev/null -w "%{size_download}" "$APP_URL" 2>/dev/null)

if [ "$compressed_size" -lt "$uncompressed_size" ]; then
    compression_ratio=$(echo "scale=1; $uncompressed_size / $compressed_size" | bc)
    echo -e "${GREEN}✅ Ratio ${compression_ratio}x${NC}"
else
    echo -e "${YELLOW}⚠️  Pas de compression${NC}"
fi

# Test de cache
echo -n "  Testing cache headers... "
cache_headers=$(curl -s -I "$APP_URL" | grep -i "cache-control\|etag\|expires" | wc -l)
if [ "$cache_headers" -gt 0 ]; then
    echo -e "${GREEN}✅ Headers de cache présents${NC}"
else
    echo -e "${YELLOW}⚠️  Pas de headers de cache${NC}"
fi

# Test de HTTP/2
echo -n "  Testing HTTP/2... "
http_version=$(curl -s -I --http2 "$APP_URL" | head -1 | grep -o "HTTP/2" || echo "HTTP/1.1")
if [ "$http_version" = "HTTP/2" ]; then
    echo -e "${GREEN}✅ HTTP/2${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP/1.1${NC}"
fi

echo ""

# Test de charge simple
echo -e "${YELLOW}📋 Test de Charge Simple${NC}"
echo -n "  Testing concurrent requests... "

# Test avec 10 requêtes simultanées
start_time=$(date +%s.%N)
for i in {1..10}; do
    curl -s -o /dev/null "$APP_URL" &
done
wait
end_time=$(date +%s.%N)

duration=$(echo "$end_time - $start_time" | bc)
if (( $(echo "$duration < 5.0" | bc -l) )); then
    echo -e "${GREEN}✅ ${duration}s pour 10 requêtes${NC}"
else
    echo -e "${YELLOW}⚠️  ${duration}s (lent)${NC}"
fi

echo ""

# Résumé et recommandations
echo -e "${BLUE}📊 Résumé des Performances${NC}"
echo ""

# Calculer un score global (simplifié)
echo "Métriques clés:"
echo "• Temps de réponse moyen: Voir résultats ci-dessus"
echo "• Optimisations Clerk: Vérifiées"
echo "• Compression: Testée"
echo "• Cache: Vérifié"
echo ""

echo -e "${YELLOW}💡 Recommandations d'Optimisation:${NC}"
echo ""
echo "1. 🚀 Si temps > 3s: Optimiser le bundle size"
echo "2. 📦 Si pas de compression: Activer gzip/brotli"
echo "3. 🔄 Si pas de cache: Configurer les headers"
echo "4. ⚡ Si Clerk lent: Vérifier le preloader"
echo "5. 📱 Tester sur mobile et connexions lentes"
echo ""

echo -e "${BLUE}🔧 Outils d'Optimisation:${NC}"
echo ""
echo "• Lighthouse: npx lighthouse $APP_URL"
echo "• WebPageTest: https://webpagetest.org"
echo "• GTmetrix: https://gtmetrix.com"
echo "• Bundle Analyzer: npm run build -- --analyze"
echo ""

echo -e "${GREEN}🎉 Test de performance terminé !${NC}"
echo ""
echo -e "${YELLOW}📚 Consultez PERFORMANCE_OPTIMIZATION.md pour plus de détails${NC}"