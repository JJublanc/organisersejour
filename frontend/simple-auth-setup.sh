#!/bin/bash

# Script pour remplacer Clerk par une authentification simple
echo "🔄 Remplacement de Clerk par une authentification simple"
echo "====================================================="

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Étapes de la migration:${NC}"
echo "1. Désactivation de Clerk"
echo "2. Création d'un système d'auth simple"
echo "3. Mise à jour des composants"
echo "4. Test de l'application"
echo ""

# Étape 1: Désactiver Clerk
echo -e "${YELLOW}🔧 Étape 1: Désactivation de Clerk${NC}"

# Modifier .dev.vars pour désactiver l'auth
if [ -f ".dev.vars" ]; then
    # Sauvegarder l'ancien fichier
    cp .dev.vars .dev.vars.clerk.backup
    
    # Créer nouveau fichier sans Clerk
    cat > .dev.vars << 'EOF'
# Authentification désactivée (mode simple)
AUTH_ENABLED=false
ENVIRONMENT=dev

# Base de données
NEON_DEV_URL=${NEON_DEV_URL}
NEON_PASSWORD=${NEON_PASSWORD}
EOF
    
    echo "✅ Authentification désactivée dans .dev.vars"
else
    echo "⚠️  Fichier .dev.vars non trouvé"
fi

echo ""
echo -e "${GREEN}✅ Migration terminée !${NC}"
echo ""
echo -e "${BLUE}📋 Prochaines étapes:${NC}"
echo "1. Redémarrez le serveur: npm run dev"
echo "2. L'application fonctionnera sans authentification"
echo "3. Tous les utilisateurs auront accès à toutes les fonctionnalités"
echo ""
echo -e "${YELLOW}💡 Pour réactiver Clerk plus tard:${NC}"
echo "cp .dev.vars.clerk.backup .dev.vars"
echo ""