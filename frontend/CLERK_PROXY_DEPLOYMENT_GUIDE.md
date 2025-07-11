# Guide de Déploiement du Proxy Clerk

## Résumé des Corrections Appliquées

### Problème Cloudflare 1000 "DNS points to prohibited IP"
✅ **Résolu** - Les corrections suivantes ont été appliquées au proxy :

1. **Headers sélectifs** : Seuls les headers nécessaires sont copiés pour éviter les conflits Cloudflare
2. **X-Forwarded-For sans cf-connecting-ip** : Utilisation de `x-forwarded-for` et `x-real-ip`
3. **Configuration correcte des headers Clerk**

### Configuration du Proxy

Le proxy est configuré avec :
- **URL de base** : `https://frontend-api.clerk.dev` (correct selon la documentation)
- **Host** : `clerk.organisersejour.com` (correspond à la clé publishable)
- **Clerk-Proxy-Url** : `https://organisersejour.com/api/clerk-proxy`
- **Headers filtrés** : Seuls les headers essentiels sont transmis

## Étapes de Déploiement

### 1. Déployer le Code
```bash
# Déployer avec les corrections Cloudflare 1000
npm run deploy
```

### 2. Configurer le Dashboard Clerk
1. Aller sur [Clerk Dashboard](https://dashboard.clerk.com)
2. Sélectionner votre application
3. Aller dans **Domains** page
4. Dans la section **Frontend API**, cliquer sur **Advanced** dropdown
5. Dans le champ **Proxy URL**, entrer : `https://organisersejour.com/api/clerk-proxy`
6. Sauvegarder

### 3. Vérifier les Variables d'Environnement
Assurez-vous que ces variables sont configurées dans Cloudflare Pages :
- `CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsub3JnYW5pc2Vyc2Vqb3VyLmNvbSQ`
- `CLERK_SECRET_KEY=sk_live_...` (clé secrète de production)
- `USE_CLERK_PROXY=true`

### 4. Tester en Production
1. Accéder à `https://organisersejour.com/api/clerk-proxy/v1/environment`
2. Vérifier qu'il n'y a plus d'erreur 1000 ou 400
3. Tester l'authentification sur le site

## Résolution des Problèmes

### Erreur 1000 "DNS points to prohibited IP"
- ✅ **Résolu** : Headers Cloudflare filtrés dans le proxy

### Erreur 400 "Invalid host"  
- ✅ **Résolu** : Host header configuré sur `clerk.organisersejour.com`

### Erreur 401 "Invalid secret key"
- Vérifier que `CLERK_SECRET_KEY` est configuré avec la clé de production
- Vérifier que le proxy URL est configuré dans le Dashboard Clerk

## Test de Validation

Une fois déployé, ces endpoints doivent fonctionner :
- `https://organisersejour.com/api/clerk-proxy/v1/environment` (200 OK)
- L'authentification sur le site principal

## Notes Importantes

1. **Le proxy URL doit être configuré dans Clerk AVANT d'être activé**
2. **Les clés de production doivent correspondre au domaine `organisersejour.com`**
3. **Les headers Cloudflare sont maintenant filtrés pour éviter les conflits**