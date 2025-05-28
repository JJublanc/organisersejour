#!/bin/bash

# Script de configuration pour le déploiement Clerk en production
# Usage: ./setup-production.sh

echo "🚀 Configuration Clerk pour Production"
echo "====================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Ce script vous guide pour configurer Clerk en production${NC}"
echo ""

# Vérification des prérequis
echo -e "${YELLOW}🔍 Vérification des prérequis...${NC}"

if [ ! -f ".dev.vars" ]; then
    echo -e "${RED}❌ Fichier .dev.vars non trouvé${NC}"
    exit 1
fi

if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler CLI non installé${NC}"
    echo "Installez avec: npm install -g wrangler"
    exit 1
fi

echo -e "${GREEN}✅ Prérequis validés${NC}"
echo ""

# Collecte des informations
echo -e "${BLUE}📝 Configuration des clés Clerk${NC}"
echo ""

read -p "🔑 Clé publique Clerk PRODUCTION (pk_live_...): " CLERK_PROD_PK
read -s -p "🔐 Clé secrète Clerk PRODUCTION (sk_live_...): " CLERK_PROD_SK
echo ""
read -p "🔑 Clé publique Clerk PREPROD (pk_live_...): " CLERK_PREPROD_PK
read -s -p "🔐 Clé secrète Clerk PREPROD (sk_live_...): " CLERK_PREPROD_SK
echo ""

# Validation des clés
if [[ ! $CLERK_PROD_PK =~ ^pk_live_ ]]; then
    echo -e "${RED}❌ La clé publique production doit commencer par 'pk_live_'${NC}"
    exit 1
fi

if [[ ! $CLERK_PROD_SK =~ ^sk_live_ ]]; then
    echo -e "${RED}❌ La clé secrète production doit commencer par 'sk_live_'${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Clés validées${NC}"
echo ""

# Nom du projet Cloudflare Pages
read -p "📦 Nom de votre projet Cloudflare Pages: " CF_PROJECT_NAME

echo ""
echo -e "${BLUE}🔧 Configuration des variables d'environnement...${NC}"

# Configuration pour la préproduction (Preview)
echo -e "${YELLOW}📋 Configuration PREPROD (Preview)...${NC}"

cat > .env.preprod << EOF
# Clerk Préproduction
CLERK_PUBLISHABLE_KEY=${CLERK_PREPROD_PK}
CLERK_SECRET_KEY=${CLERK_PREPROD_SK}
AUTH_ENABLED=true
ENVIRONMENT=preprod

# Base de données
NEON_PREPROD_URL=\${NEON_PREPROD_URL}
NEON_PASSWORD=\${NEON_PASSWORD}
EOF

# Configuration pour la production
echo -e "${YELLOW}📋 Configuration PRODUCTION...${NC}"

cat > .env.production << EOF
# Clerk Production
CLERK_PUBLISHABLE_KEY=${CLERK_PROD_PK}
CLERK_SECRET_KEY=${CLERK_PROD_SK}
AUTH_ENABLED=true
ENVIRONMENT=prod

# Base de données
NEON_PROD_URL=\${NEON_PROD_URL}
NEON_PASSWORD=\${NEON_PASSWORD}
EOF

echo -e "${GREEN}✅ Fichiers de configuration créés${NC}"
echo ""

# Instructions pour Cloudflare Pages
echo -e "${BLUE}📋 Instructions pour Cloudflare Pages${NC}"
echo ""
echo -e "${YELLOW}1. Allez sur https://dash.cloudflare.com/pages${NC}"
echo -e "${YELLOW}2. Sélectionnez votre projet: ${CF_PROJECT_NAME}${NC}"
echo -e "${YELLOW}3. Allez dans Settings > Environment Variables${NC}"
echo ""

echo -e "${BLUE}🔧 Variables à ajouter pour PREVIEW:${NC}"
echo "CLERK_PUBLISHABLE_KEY=${CLERK_PREPROD_PK}"
echo "CLERK_SECRET_KEY=${CLERK_PREPROD_SK}"
echo "AUTH_ENABLED=true"
echo "ENVIRONMENT=preprod"
echo ""

echo -e "${BLUE}🔧 Variables à ajouter pour PRODUCTION:${NC}"
echo "CLERK_PUBLISHABLE_KEY=${CLERK_PROD_PK}"
echo "CLERK_SECRET_KEY=${CLERK_PROD_SK}"
echo "AUTH_ENABLED=true"
echo "ENVIRONMENT=prod"
echo ""

# Instructions Clerk Dashboard
echo -e "${BLUE}📋 Configuration Clerk Dashboard${NC}"
echo ""
echo -e "${YELLOW}1. Allez sur https://dashboard.clerk.com${NC}"
echo -e "${YELLOW}2. Sélectionnez votre application${NC}"
echo -e "${YELLOW}3. Allez dans Settings > Domains${NC}"
echo -e "${YELLOW}4. Ajoutez vos domaines:${NC}"
echo "   - https://${CF_PROJECT_NAME}.pages.dev (production)"
echo "   - https://*.${CF_PROJECT_NAME}.pages.dev (preview)"
echo ""

# Script de déploiement
echo -e "${BLUE}📦 Création du script de déploiement...${NC}"

cat > deploy-clerk.sh << 'EOF'
#!/bin/bash

echo "🚀 Déploiement Clerk"
echo "==================="

# Vérification de la branche
BRANCH=$(git branch --show-current)
echo "📍 Branche actuelle: $BRANCH"

if [ "$BRANCH" = "main" ]; then
    echo "🎯 Déploiement en PRODUCTION"
    read -p "Êtes-vous sûr de vouloir déployer en production ? (y/N): " confirm
    if [[ $confirm != [yY] ]]; then
        echo "❌ Déploiement annulé"
        exit 1
    fi
else
    echo "🧪 Déploiement en PREVIEW"
fi

# Build et déploiement
echo "🔨 Build de l'application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi"
    echo "📤 Push vers Git..."
    git add .
    git commit -m "Deploy Clerk authentication - $(date)"
    git push origin $BRANCH
    echo "🎉 Déploiement lancé !"
else
    echo "❌ Erreur lors du build"
    exit 1
fi
EOF

chmod +x deploy-clerk.sh

echo -e "${GREEN}✅ Script de déploiement créé: deploy-clerk.sh${NC}"
echo ""

# Checklist finale
echo -e "${BLUE}📋 Checklist de déploiement${NC}"
echo ""
echo "□ Configurer les variables dans Cloudflare Pages"
echo "□ Ajouter les domaines dans Clerk Dashboard"
echo "□ Tester en préproduction avec: git push origin feature-branch"
echo "□ Déployer en production avec: ./deploy-clerk.sh"
echo ""

echo -e "${GREEN}🎉 Configuration terminée !${NC}"
echo ""
echo -e "${YELLOW}📚 Consultez DEPLOYMENT_CLERK.md pour plus de détails${NC}"