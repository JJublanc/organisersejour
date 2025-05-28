#!/bin/bash

# Script de diagnostic pour les problèmes d'authentification Clerk
# Usage: ./debug-clerk.sh [URL]

echo "🔍 Diagnostic Clerk - Authentification"
echo "====================================="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# URL à tester
if [ -z "$1" ]; then
    APP_URL="http://localhost:5173"
    echo -e "${YELLOW}ℹ️  Utilisation de l'URL par défaut: $APP_URL${NC}"
else
    APP_URL=$1
fi

APP_URL=${APP_URL%/}

echo ""
echo -e "${BLUE}🎯 Diagnostic de l'URL: ${APP_URL}${NC}"
echo ""

# Fonction de test avec curl
test_endpoint() {
    local url=$1
    local description=$2
    
    echo -n "  Testing $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ OK ($response)${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL ($response)${NC}"
        return 1
    fi
}

# Fonction de test de contenu
test_content() {
    local url=$1
    local description=$2
    local search_text=$3
    
    echo -n "  Testing $description... "
    
    content=$(curl -s "$url" 2>/dev/null)
    
    if echo "$content" | grep -q "$search_text"; then
        echo -e "${GREEN}✅ Trouvé${NC}"
        return 0
    else
        echo -e "${RED}❌ Non trouvé${NC}"
        return 1
    fi
}

# Tests de base
echo -e "${YELLOW}📋 Tests de Base${NC}"
test_endpoint "$APP_URL" "Page d'accueil"
test_endpoint "$APP_URL/sign-in" "Page de connexion"
test_endpoint "$APP_URL/sign-up" "Page d'inscription"

echo ""

# Tests de configuration Clerk
echo -e "${YELLOW}📋 Configuration Clerk${NC}"

# Vérifier la présence des clés Clerk
echo -n "  Vérification clés Clerk... "
clerk_config=$(curl -s "$APP_URL" | grep -o "CLERK_PUBLISHABLE_KEY\|pk_test_\|pk_live_" || echo "not found")
if [ "$clerk_config" != "not found" ]; then
    echo -e "${GREEN}✅ Clés détectées${NC}"
else
    echo -e "${RED}❌ Clés non détectées${NC}"
fi

# Vérifier l'activation de l'auth
test_content "$APP_URL" "Auth activée" "authEnabled.*true"

# Vérifier le preloader
test_content "$APP_URL" "Preloader Clerk" "ClerkPreloader"

# Vérifier les composants Clerk
test_content "$APP_URL" "ClerkProvider" "ClerkProvider"
test_content "$APP_URL" "ClerkAuth" "ClerkAuth"

echo ""

# Tests des scripts Clerk
echo -e "${YELLOW}📋 Scripts et Ressources Clerk${NC}"

# Vérifier le chargement du script Clerk
echo -n "  Script Clerk (js.clerk.com)... "
clerk_script_check=$(curl -s -I "https://js.clerk.com/v4/clerk.js" -w "%{http_code}" -o /dev/null 2>/dev/null)
if [ "$clerk_script_check" = "200" ]; then
    echo -e "${GREEN}✅ Accessible${NC}"
else
    echo -e "${RED}❌ Non accessible ($clerk_script_check)${NC}"
fi

# Vérifier le CSS Clerk
echo -n "  CSS Clerk... "
clerk_css_check=$(curl -s -I "https://js.clerk.com/v4/clerk.css" -w "%{http_code}" -o /dev/null 2>/dev/null)
if [ "$clerk_css_check" = "200" ]; then
    echo -e "${GREEN}✅ Accessible${NC}"
else
    echo -e "${YELLOW}⚠️  Non accessible ($clerk_css_check)${NC}"
fi

echo ""

# Tests des fonctionnalités
echo -e "${YELLOW}📋 Tests des Fonctionnalités${NC}"

# Vérifier les fonctions d'authentification
test_content "$APP_URL" "Fonction redirectToSignIn" "redirectToSignIn"
test_content "$APP_URL" "Fonction openSignIn" "openSignIn"
test_content "$APP_URL" "Gestion des timeouts" "timeout"

echo ""

# Tests de performance
echo -e "${YELLOW}📋 Performance Clerk${NC}"

# Temps de chargement page d'accueil
echo -n "  Temps de chargement accueil... "
time_home=$(curl -s -o /dev/null -w "%{time_total}" "$APP_URL" 2>/dev/null)
if (( $(echo "$time_home < 3.0" | bc -l) )); then
    echo -e "${GREEN}✅ ${time_home}s${NC}"
else
    echo -e "${YELLOW}⚠️  ${time_home}s (lent)${NC}"
fi

# Temps de chargement page de connexion
echo -n "  Temps de chargement sign-in... "
time_signin=$(curl -s -o /dev/null -w "%{time_total}" "$APP_URL/sign-in" 2>/dev/null)
if (( $(echo "$time_signin < 3.0" | bc -l) )); then
    echo -e "${GREEN}✅ ${time_signin}s${NC}"
else
    echo -e "${YELLOW}⚠️  ${time_signin}s (lent)${NC}"
fi

echo ""

# Diagnostic des erreurs communes
echo -e "${YELLOW}📋 Diagnostic des Erreurs Communes${NC}"

# Vérifier les erreurs JavaScript
echo -n "  Erreurs JavaScript... "
js_errors=$(curl -s "$APP_URL" | grep -o "error\|Error\|ERROR" | wc -l)
if [ "$js_errors" -eq 0 ]; then
    echo -e "${GREEN}✅ Aucune erreur détectée${NC}"
else
    echo -e "${YELLOW}⚠️  $js_errors erreurs potentielles${NC}"
fi

# Vérifier les problèmes de CORS
echo -n "  Headers CORS... "
cors_headers=$(curl -s -I "$APP_URL" | grep -i "access-control" | wc -l)
if [ "$cors_headers" -gt 0 ]; then
    echo -e "${GREEN}✅ Headers CORS présents${NC}"
else
    echo -e "${YELLOW}⚠️  Pas de headers CORS${NC}"
fi

echo ""

# Recommandations
echo -e "${BLUE}💡 Recommandations de Débogage${NC}"
echo ""

if [ "$clerk_config" = "not found" ]; then
    echo -e "${RED}❌ Problème: Clés Clerk non détectées${NC}"
    echo "   → Vérifiez les variables d'environnement"
    echo "   → Consultez le fichier .dev.vars"
    echo ""
fi

if [ "$clerk_script_check" != "200" ]; then
    echo -e "${RED}❌ Problème: Script Clerk inaccessible${NC}"
    echo "   → Vérifiez votre connexion internet"
    echo "   → Vérifiez les paramètres de firewall"
    echo ""
fi

echo -e "${YELLOW}🔧 Actions de Débogage:${NC}"
echo ""
echo "1. 📋 Vérifiez les logs du navigateur (F12 > Console)"
echo "2. 🔍 Vérifiez les variables d'environnement:"
echo "   cat .dev.vars | grep CLERK"
echo "3. 🧪 Testez manuellement les boutons de connexion"
echo "4. 📊 Utilisez les outils de développement:"
echo "   - Network tab pour voir les requêtes"
echo "   - Console pour voir les erreurs JavaScript"
echo "5. 🔄 Redémarrez le serveur de développement"
echo ""

echo -e "${BLUE}📚 Ressources Utiles:${NC}"
echo ""
echo "• Documentation Clerk: https://clerk.com/docs"
echo "• Guide de débogage: PERFORMANCE_OPTIMIZATION.md"
echo "• Test de performance: ./test-performance.sh"
echo "• Logs détaillés: DEBUG=clerk:* npm run dev"
echo ""

echo -e "${GREEN}🎉 Diagnostic terminé !${NC}"
echo ""
echo -e "${YELLOW}💬 Si le problème persiste:${NC}"
echo "1. Vérifiez que Clerk est bien initialisé dans la console"
echo "2. Testez avec un autre navigateur"
echo "3. Vérifiez les paramètres de votre compte Clerk"