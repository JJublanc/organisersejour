# 🧪 Guide de Test - Variabilisation Clerk

## 📋 **Résumé de l'implémentation**

La stratégie de variabilisation complète a été mise en place avec :

### ✅ **Fichiers modifiés/créés**
1. **`wrangler.toml`** - Configuration multi-environnements avec variables proxy
2. **`.dev.vars.example`** - Template des variables de développement
3. **`.dev.vars`** - Variables locales mises à jour
4. **`src/app.d.ts`** - Types TypeScript pour les nouvelles variables
5. **`src/lib/clerk-auth.ts`** - Support du proxy dans l'initialisation Clerk
6. **`src/lib/components/ClerkProvider.svelte`** - Composant avec configuration proxy
7. **`src/routes/+layout.server.ts`** - Passage des variables de proxy
8. **`src/routes/+layout.svelte`** - Utilisation de la configuration proxy
9. **`src/routes/api/__clerk/[...path]/+server.ts`** - Handler du proxy Clerk

## 🔧 **Configuration par environnement**

### 🏠 **Local (dev)**
```bash
USE_CLERK_PROXY=false
CLERK_PROXY_URL=http://localhost:5173/__clerk
CLERK_API_URL=https://api.clerk.com
```

### 🧪 **Préprod (preview)**
```bash
USE_CLERK_PROXY=true
CLERK_PROXY_URL=https://preprod.organisersejour.pages.dev/__clerk
```

### 🚀 **Production**
```bash
USE_CLERK_PROXY=true
CLERK_PROXY_URL=https://organisersejour.pages.dev/__clerk
```

## 🧪 **Tests à effectuer**

### 1. **Test en local (proxy désactivé)**
```bash
# Vérifier que l'application fonctionne normalement
npm run dev

# Dans les logs, vous devriez voir :
# 🔍 [DIAGNOSTIC] Use Clerk Proxy: false
# 🔍 [DIAGNOSTIC] Clerk Proxy URL: http://localhost:5173/__clerk
```

### 2. **Test du proxy en local (optionnel)**
```bash
# Modifier .dev.vars temporairement :
USE_CLERK_PROXY=true

# Redémarrer le serveur
npm run dev

# Dans les logs, vous devriez voir :
# 🔍 [DIAGNOSTIC] Use Clerk Proxy: true
# 🔍 [DIAGNOSTIC] Using proxy: true
# 🔍 [Clerk Proxy] GET request to: /__clerk/...
```

### 3. **Test du handler proxy directement**
```bash
# Tester l'endpoint proxy (avec le serveur en cours)
curl http://localhost:5173/__clerk/v1/me \
  -H "Authorization: Bearer your_session_token"

# Ou dans le navigateur :
# http://localhost:5173/__clerk/v1/environment
```

### 4. **Vérification des logs diagnostiques**

Lors du démarrage, vous devriez voir dans la console :

```
🔍 [DIAGNOSTIC] Layout Server Load
🔍 [DIAGNOSTIC] Environment: dev
🔍 [DIAGNOSTIC] Use Clerk Proxy: false
🔍 [DIAGNOSTIC] Clerk Proxy URL: http://localhost:5173/__clerk
🔍 [DIAGNOSTIC] Clerk API URL: https://api.clerk.com

[ClerkProvider] Clerk config: {
  useProxy: false,
  proxyUrl: "http://localhost:5173/__clerk",
  apiUrl: "https://api.clerk.com",
  environment: "dev"
}
```

## 🚀 **Déploiement en préprod/production**

### 1. **Configuration des secrets Cloudflare**
```bash
# Préprod
wrangler secret put CLERK_PUBLISHABLE_KEY --env preview
wrangler secret put CLERK_SECRET_KEY --env preview

# Production
wrangler secret put CLERK_PUBLISHABLE_KEY --env production
wrangler secret put CLERK_SECRET_KEY --env production
```

### 2. **Déploiement**
```bash
# Préprod
wrangler pages deploy --env preview

# Production
wrangler pages deploy --env production
```

### 3. **Vérification post-déploiement**
- Vérifier que `USE_CLERK_PROXY=true` en préprod/prod
- Tester l'authentification via le proxy
- Vérifier les logs dans Cloudflare Dashboard

## 🔍 **Debugging**

### **Variables d'environnement**
```bash
# Vérifier les variables chargées
console.log('Environment variables:', {
  ENVIRONMENT: platform?.env?.ENVIRONMENT,
  USE_CLERK_PROXY: platform?.env?.USE_CLERK_PROXY,
  CLERK_PROXY_URL: platform?.env?.CLERK_PROXY_URL
});
```

### **Proxy handler**
```bash
# Tester le proxy directement
curl -X GET "https://votre-domaine.pages.dev/__clerk/v1/environment" \
  -H "Authorization: Bearer sk_test_..."
```

### **Clerk configuration**
```bash
# Dans le navigateur, vérifier la configuration Clerk
console.log('Clerk instance:', window.Clerk);
console.log('Clerk config:', window.Clerk?.options);
```

## ✅ **Checklist de validation**

- [ ] **Local** : Application fonctionne sans proxy (`USE_CLERK_PROXY=false`)
- [ ] **Local** : Proxy handler répond sur `http://localhost:5173/__clerk/*`
- [ ] **Local** : Logs diagnostiques affichent la bonne configuration
- [ ] **Types** : Pas d'erreurs TypeScript
- [ ] **Variables** : Toutes les variables sont définies dans `wrangler.toml`
- [ ] **Secrets** : Clés Clerk configurées pour préprod/prod
- [ ] **Préprod** : Proxy activé et fonctionnel
- [ ] **Production** : Proxy activé et fonctionnel

## 🎯 **Prochaines étapes**

1. **Tester la configuration actuelle** en local
2. **Configurer les secrets** Cloudflare pour préprod/prod
3. **Déployer en préprod** et tester le proxy
4. **Valider en production** une fois les tests concluants

La variabilisation est maintenant complète et prête pour tous les environnements !