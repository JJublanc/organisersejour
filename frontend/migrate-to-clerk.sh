#!/bin/bash

# Script de migration automatique vers Clerk
# Usage: ./migrate-to-clerk.sh

echo "🔄 Migration de CloudFlare Zero Trust vers Clerk"
echo "================================================"

# Vérification des prérequis
if [ ! -f ".dev.vars" ]; then
    echo "❌ Fichier .dev.vars non trouvé. Créez-le d'abord avec vos clés Clerk."
    echo "Exemple de contenu :"
    echo "CLERK_PUBLISHABLE_KEY=pk_test_votre_cle"
    echo "CLERK_SECRET_KEY=sk_test_votre_cle"
    echo "AUTH_ENABLED=true"
    exit 1
fi

# Vérification des clés Clerk dans .dev.vars
if ! grep -q "CLERK_PUBLISHABLE_KEY" .dev.vars; then
    echo "❌ CLERK_PUBLISHABLE_KEY manquante dans .dev.vars"
    exit 1
fi

if ! grep -q "CLERK_SECRET_KEY" .dev.vars; then
    echo "❌ CLERK_SECRET_KEY manquante dans .dev.vars"
    exit 1
fi

echo "✅ Variables d'environnement Clerk détectées"

# Sauvegarde des fichiers CloudFlare
echo "📦 Sauvegarde des fichiers CloudFlare Zero Trust..."

if [ -f "src/hooks.server.ts" ]; then
    mv src/hooks.server.ts src/hooks.server.cloudflare.ts
    echo "   ✅ hooks.server.ts → hooks.server.cloudflare.ts"
fi

if [ -f "src/routes/+layout.server.ts" ]; then
    mv src/routes/+layout.server.ts src/routes/layout.server.cloudflare.ts
    echo "   ✅ +layout.server.ts → layout.server.cloudflare.ts"
fi

if [ -f "src/routes/+layout.svelte" ]; then
    mv src/routes/+layout.svelte src/routes/layout.cloudflare.svelte
    echo "   ✅ +layout.svelte → layout.cloudflare.svelte"
fi

if [ -f "src/routes/protected/+page.server.ts" ]; then
    mv src/routes/protected/+page.server.ts src/routes/protected/page.server.cloudflare.ts
    echo "   ✅ protected/+page.server.ts → protected/page.server.cloudflare.ts"
fi

# Activation des fichiers Clerk
echo "🔧 Activation des fichiers Clerk..."

if [ -f "src/hooks.clerk.ts" ]; then
    cp src/hooks.clerk.ts src/hooks.server.ts
    echo "   ✅ hooks.clerk.ts → hooks.server.ts"
fi

if [ -f "src/routes/layout.clerk.server.ts" ]; then
    cp src/routes/layout.clerk.server.ts src/routes/+layout.server.ts
    echo "   ✅ layout.clerk.server.ts → +layout.server.ts"
fi

if [ -f "src/routes/layout.clerk.svelte" ]; then
    cp src/routes/layout.clerk.svelte src/routes/+layout.svelte
    echo "   ✅ layout.clerk.svelte → +layout.svelte"
fi

if [ -f "src/routes/protected/page.clerk.server.ts" ]; then
    cp src/routes/protected/page.clerk.server.ts src/routes/protected/+page.server.ts
    echo "   ✅ protected/page.clerk.server.ts → protected/+page.server.ts"
fi

echo ""
echo "🎉 Migration terminée avec succès !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez votre application Clerk sur https://dashboard.clerk.com"
echo "2. Ajoutez vos domaines autorisés (localhost:5173, votre-domaine.pages.dev)"
echo "3. Testez avec : npm run dev"
echo "4. Visitez /protected pour tester l'authentification"
echo ""
echo "📚 Consultez MIGRATION_CLERK.md pour plus de détails"
echo ""
echo "🔙 Pour revenir à CloudFlare Zero Trust, utilisez : ./rollback-clerk.sh"