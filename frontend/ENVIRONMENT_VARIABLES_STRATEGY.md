# 🔧 Stratégie de Variables d'Environnement pour Clerk Proxy

## 📊 **État actuel de la configuration**

### ✅ **Configuration existante dans `wrangler.toml`**
```toml
# Environnement par défaut (dev)
[vars]
ENVIRONMENT = "dev"
CLERK_PUBLISHABLE_KEY = ""
CLERK_SECRET_KEY = ""

# Préprod
[env.preview]
vars = { ENVIRONMENT = "preprod" }

# Production  
[env.production]
vars = { ENVIRONMENT = "prod" }
```

## 🎯 **Variables nécessaires pour le proxy Clerk**

### 1. **Variables de base Clerk**
- `CLERK_PUBLISHABLE_KEY` : Clé publique (différente par environnement)
- `CLERK_SECRET_KEY` : Clé secrète (différente par environnement)

### 2. **Variables spécifiques au proxy**
- `CLERK_PROXY_URL` : URL du proxy (ex: `https://mondomaine.com/__clerk`)
- `CLERK_API_URL` : URL de l'API Clerk (par défaut: `https://api.clerk.com`)
- `USE_CLERK_PROXY` : Booléen pour activer/désactiver le proxy

### 3. **Variables par environnement**

#### 🏠 **Local (dev)**
```bash
# .dev.vars
CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
USE_CLERK_PROXY=false
CLERK_PROXY_URL=http://localhost:5173/__clerk
CLERK_API_URL=https://api.clerk.com
```

#### 🧪 **Préprod (preview)**
```bash
# Secrets Cloudflare
CLERK_PUBLISHABLE_KEY=pk_test_xxx (ou pk_live_xxx pour préprod)
CLERK_SECRET_KEY=sk_test_xxx (ou sk_live_xxx pour préprod)
USE_CLERK_PROXY=true
CLERK_PROXY_URL=https://preprod.mondomaine.com/__clerk
CLERK_API_URL=https://api.clerk.com
```

#### 🚀 **Production**
```bash
# Secrets Cloudflare
CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx
USE_CLERK_PROXY=true
CLERK_PROXY_URL=https://mondomaine.com/__clerk
CLERK_API_URL=https://api.clerk.com
```

## 🔄 **Modifications nécessaires**

### 1. **Mise à jour de `wrangler.toml`**
```toml
[vars]
ENVIRONMENT = "dev"
# Variables Clerk de base
CLERK_PUBLISHABLE_KEY = ""
CLERK_SECRET_KEY = ""
# Variables proxy
USE_CLERK_PROXY = "false"
CLERK_PROXY_URL = "http://localhost:5173/__clerk"
CLERK_API_URL = "https://api.clerk.com"

[env.preview]
vars = { 
  ENVIRONMENT = "preprod",
  USE_CLERK_PROXY = "true",
  CLERK_PROXY_URL = "https://preprod.organisersejour.pages.dev/__clerk"
}

[env.production]
vars = { 
  ENVIRONMENT = "prod",
  USE_CLERK_PROXY = "true", 
  CLERK_PROXY_URL = "https://organisersejour.pages.dev/__clerk"
}
```

### 2. **Création d'un fichier `.dev.vars.example`**
```bash
# Clerk Authentication - Development Keys
CLERK_PUBLISHABLE_KEY=pk_test_your_dev_key_here
CLERK_SECRET_KEY=sk_test_your_dev_secret_here

# Clerk Proxy Configuration
USE_CLERK_PROXY=false
CLERK_PROXY_URL=http://localhost:5173/__clerk
CLERK_API_URL=https://api.clerk.com

# Database Configuration
NEON_DEV_URL=your_neon_dev_url_here
NEON_PASSWORD=your_neon_password_here
```

### 3. **Logique conditionnelle dans le code**

#### Dans `clerk-auth.ts`
```typescript
export async function initializeClerk(publishableKey: string, options?: any) {
  const useProxy = options?.useProxy || false;
  const proxyUrl = options?.proxyUrl;
  
  const clerkOptions = {
    ...options,
    ...(useProxy && proxyUrl ? { proxyUrl } : {})
  };
  
  // Initialisation avec ou sans proxy selon l'environnement
}
```

#### Dans `+layout.server.ts`
```typescript
export const load: LayoutServerLoad = async ({ platform, url }) => {
  const env = platform?.env;
  
  return {
    clerkPublishableKey: env?.CLERK_PUBLISHABLE_KEY,
    useClerkProxy: env?.USE_CLERK_PROXY === 'true',
    clerkProxyUrl: env?.CLERK_PROXY_URL,
    environment: env?.ENVIRONMENT || 'dev'
  };
};
```

## 🎯 **Avantages de cette approche**

### ✅ **Flexibilité**
- Proxy désactivé en local (plus simple pour le debug)
- Proxy activé en préprod/prod (sécurité et contrôle)

### ✅ **Sécurité**
- Clés différentes par environnement
- Secrets stockés dans Cloudflare Dashboard

### ✅ **Maintenance**
- Configuration centralisée dans `wrangler.toml`
- Variables d'environnement claires et documentées

### ✅ **Debug**
- Possibilité de tester le proxy en local si nécessaire
- Logs différenciés par environnement

## 🚀 **Prochaines étapes**

1. **Mettre à jour `wrangler.toml`** avec les nouvelles variables
2. **Créer `.dev.vars.example`** pour documenter les variables locales
3. **Modifier le code** pour supporter la logique conditionnelle
4. **Créer le proxy handler** avec la configuration appropriée
5. **Tester** dans chaque environnement

Cette stratégie garantit que le système fonctionne de manière cohérente en local, préprod et production, avec la flexibilité d'activer ou désactiver le proxy selon les besoins.