#!/bin/bash

# Script de rollback vers CloudFlare Zero Trust
# Usage: ./rollback-clerk.sh

echo "🔄 Rollback vers CloudFlare Zero Trust"
echo "======================================"

# Sauvegarde des fichiers Clerk actifs
echo "📦 Sauvegarde des fichiers Clerk actifs..."

if [ -f "src/hooks.server.ts" ]; then
    cp src/hooks.server.ts src/hooks.clerk.backup.ts
    echo "   ✅ hooks.server.ts → hooks.clerk.backup.ts"
fi

if [ -f "src/routes/+layout.server.ts" ]; then
    cp src/routes/+layout.server.ts src/routes/+layout.clerk.backup.server.ts
    echo "   ✅ +layout.server.ts → +layout.clerk.backup.server.ts"
fi

if [ -f "src/routes/+layout.svelte" ]; then
    cp src/routes/+layout.svelte src/routes/+layout.clerk.backup.svelte
    echo "   ✅ +layout.svelte → +layout.clerk.backup.svelte"
fi

if [ -f "src/routes/protected/+page.server.ts" ]; then
    cp src/routes/protected/+page.server.ts src/routes/protected/+page.clerk.backup.server.ts
    echo "   ✅ protected/+page.server.ts → protected/+page.clerk.backup.server.ts"
fi

# Restauration des fichiers CloudFlare
echo "🔧 Restauration des fichiers CloudFlare Zero Trust..."

if [ -f "src/hooks.server.cloudflare.ts" ]; then
    cp src/hooks.server.cloudflare.ts src/hooks.server.ts
    echo "   ✅ hooks.server.cloudflare.ts → hooks.server.ts"
else
    echo "   ❌ hooks.server.cloudflare.ts non trouvé"
fi

if [ -f "src/routes/layout.server.cloudflare.ts" ]; then
    cp src/routes/layout.server.cloudflare.ts src/routes/+layout.server.ts
    echo "   ✅ layout.server.cloudflare.ts → +layout.server.ts"
else
    echo "   ❌ layout.server.cloudflare.ts non trouvé"
fi

if [ -f "src/routes/layout.cloudflare.svelte" ]; then
    cp src/routes/layout.cloudflare.svelte src/routes/+layout.svelte
    echo "   ✅ layout.cloudflare.svelte → +layout.svelte"
else
    echo "   ❌ layout.cloudflare.svelte non trouvé"
fi

if [ -f "src/routes/protected/page.server.cloudflare.ts" ]; then
    cp src/routes/protected/page.server.cloudflare.ts src/routes/protected/+page.server.ts
    echo "   ✅ protected/page.server.cloudflare.ts → protected/+page.server.ts"
else
    echo "   ❌ protected/page.server.cloudflare.ts non trouvé"
fi

echo ""
echo "🎉 Rollback terminé !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Vérifiez votre configuration CloudFlare Zero Trust"
echo "2. Testez avec : npm run dev"
echo "3. Visitez /protected pour tester l'authentification"
echo ""
echo "🔄 Pour revenir à Clerk, utilisez : ./migrate-to-clerk.sh"