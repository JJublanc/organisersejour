# Migration de CloudFlare Zero Trust vers Clerk

Ce guide explique comment migrer votre authentification de CloudFlare Zero Trust vers Clerk.

## 📋 Étapes de migration

### 1. Configuration Clerk

1. **Créer un compte Clerk** sur [clerk.com](https://clerk.com)
2. **Créer une nouvelle application** dans le dashboard Clerk
3. **Récupérer les clés** :
   - `CLERK_PUBLISHABLE_KEY` (commence par `pk_test_` ou `pk_live_`)
   - `CLERK_SECRET_KEY` (commence par `sk_test_` ou `sk_live_`)

### 2. Configuration des variables d'environnement

#### Développement local
Ajoutez dans votre fichier `.dev.vars` :
```
CLERK_PUBLISHABLE_KEY=pk_test_votre_cle_publique
CLERK_SECRET_KEY=sk_test_votre_cle_secrete
AUTH_ENABLED=true
```

#### Production (Cloudflare Pages)
Dans le dashboard Cloudflare Pages, ajoutez ces variables d'environnement :
- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `AUTH_ENABLED=true`

### 3. Activation des nouveaux fichiers

Pour activer Clerk, remplacez les fichiers suivants :

```bash
# Sauvegardez les anciens fichiers
mv src/hooks.server.ts src/hooks.server.cloudflare.ts
mv src/routes/+layout.server.ts src/routes/+layout.server.cloudflare.ts
mv src/routes/+layout.svelte src/routes/+layout.cloudflare.svelte
mv src/routes/protected/+page.server.ts src/routes/protected/+page.server.cloudflare.ts

# Activez les nouveaux fichiers Clerk
mv src/hooks.clerk.ts src/hooks.server.ts
mv src/routes/+layout.clerk.server.ts src/routes/+layout.server.ts
mv src/routes/+layout.clerk.svelte src/routes/+layout.svelte
mv src/routes/protected/+page.clerk.server.ts src/routes/protected/+page.server.ts
```

### 4. Configuration Clerk Dashboard

1. **Domaines autorisés** : Ajoutez vos domaines (localhost:5173, votre-domaine.pages.dev)
2. **Providers d'authentification** : Activez Google, GitHub, etc.
3. **Personnalisation** : Configurez l'apparence selon vos besoins

## 🔄 Différences principales

### Avant (CloudFlare Zero Trust)
- Authentification basée sur JWT dans les headers
- Configuration via CloudFlare Access
- Redirection automatique vers l'IdP

### Après (Clerk)
- SDK JavaScript intégré
- Composants UI pré-construits
- Gestion des sessions côté client et serveur
- Interface d'administration moderne

## 🧪 Test de la migration

1. **Démarrez le serveur de développement** :
   ```bash
   npm run dev
   ```

2. **Testez l'authentification** :
   - Visitez `/protected` pour tester la protection des routes
   - Utilisez les boutons de connexion/déconnexion
   - Vérifiez que les informations utilisateur s'affichent correctement

## 🔧 Dépannage

### Erreur "Clerk publishable key is required"
- Vérifiez que `CLERK_PUBLISHABLE_KEY` est définie dans `.dev.vars`
- Redémarrez le serveur de développement

### Erreur "Failed to initialize authentication"
- Vérifiez que la clé publique est valide
- Vérifiez que le domaine est autorisé dans Clerk

### L'utilisateur n'est pas reconnu
- Vérifiez que l'utilisateur existe dans Clerk
- Testez la connexion via l'interface Clerk

## 📚 Ressources

- [Documentation Clerk](https://clerk.com/docs)
- [Guide SvelteKit + Clerk](https://clerk.com/docs/quickstarts/sveltekit)
- [Dashboard Clerk](https://dashboard.clerk.com)

## 🔙 Rollback

Pour revenir à CloudFlare Zero Trust :

```bash
# Restaurez les anciens fichiers
mv src/hooks.server.ts src/hooks.clerk.ts
mv src/routes/+layout.server.ts src/routes/+layout.clerk.server.ts
mv src/routes/+layout.svelte src/routes/+layout.clerk.svelte
mv src/routes/protected/+page.server.ts src/routes/protected/+page.clerk.server.ts

# Réactivez CloudFlare
mv src/hooks.server.cloudflare.ts src/hooks.server.ts
mv src/routes/+layout.server.cloudflare.ts src/routes/+layout.server.ts
mv src/routes/+layout.cloudflare.svelte src/routes/+layout.svelte
mv src/routes/protected/+page.server.cloudflare.ts src/routes/protected/+page.server.ts