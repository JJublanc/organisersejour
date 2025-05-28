# 🚀 Déploiement Clerk - Guide Complet

## 📋 Prérequis

1. **Compte Clerk configuré** avec environnements Development et Production
2. **Cloudflare Pages** configuré avec votre repository
3. **Variables d'environnement** prêtes pour chaque environnement

## 🔧 Configuration des Variables d'Environnement

### **Préproduction (Preview)**

Dans le dashboard Cloudflare Pages > Settings > Environment Variables :

```
# Environnement: Preview
CLERK_PUBLISHABLE_KEY=pk_live_votre_cle_preprod
CLERK_SECRET_KEY=sk_live_votre_cle_preprod
AUTH_ENABLED=true
ENVIRONMENT=preprod
NEON_PREPROD_URL=votre_url_neon_preprod
NEON_PASSWORD=votre_password_neon
```

### **Production**

```
# Environnement: Production
CLERK_PUBLISHABLE_KEY=pk_live_votre_cle_production
CLERK_SECRET_KEY=sk_live_votre_cle_production
AUTH_ENABLED=true
ENVIRONMENT=prod
NEON_PROD_URL=votre_url_neon_prod
NEON_PASSWORD=votre_password_neon
```

## 🎯 Étapes de Déploiement

### **Phase 1 : Préproduction**

#### 1. Configuration Clerk Dashboard
1. Allez sur [dashboard.clerk.com](https://dashboard.clerk.com)
2. Sélectionnez votre application
3. Créez un environnement **Production** (si pas déjà fait)
4. Récupérez les clés `pk_live_` et `sk_live_`

#### 2. Domaines autorisés
Ajoutez dans Clerk > Settings > Domains :
```
https://votre-app-preview.pages.dev
https://votre-app.pages.dev
```

#### 3. Variables Cloudflare Pages
1. Dashboard Cloudflare Pages > Votre projet > Settings
2. Environment Variables > Preview
3. Ajoutez les variables listées ci-dessus

#### 4. Test de déploiement
```bash
# Créez une branche de test
git checkout -b test-clerk-preprod
git push origin test-clerk-preprod
```

### **Phase 2 : Production**

#### 1. Variables de production
1. Cloudflare Pages > Environment Variables > Production
2. Ajoutez les variables de production

#### 2. Déploiement
```bash
# Mergez dans main pour déclencher le déploiement production
git checkout main
git merge test-clerk-preprod
git push origin main
```

## 🔍 Vérifications Post-Déploiement

### **Checklist Préproduction**
- [ ] Page de connexion Clerk s'affiche
- [ ] Authentification fonctionne
- [ ] Pages protégées bloquent l'accès non authentifié
- [ ] Données utilisateur correctes
- [ ] APIs fonctionnelles

### **Checklist Production**
- [ ] Même vérifications qu'en préproduction
- [ ] Performance acceptable
- [ ] Logs sans erreurs
- [ ] Domaine personnalisé fonctionne

## 🚨 Rollback d'Urgence

Si problème en production :

### **Option 1 : Désactiver l'authentification**
```bash
# Dans Cloudflare Pages > Production
AUTH_ENABLED=false
```

### **Option 2 : Rollback complet**
```bash
# Utilisez le script de rollback
./rollback-clerk.sh
git add .
git commit -m "Rollback to CloudFlare Zero Trust"
git push origin main
```

## 📊 Monitoring

### **Métriques à surveiller**
- Taux de connexion réussie
- Temps de réponse des APIs
- Erreurs d'authentification
- Utilisation des ressources

### **Logs Clerk**
- Dashboard Clerk > Events
- Cloudflare Pages > Functions > Logs

## 🔐 Sécurité

### **Bonnes pratiques**
- Utilisez des clés différentes pour chaque environnement
- Activez 2FA sur votre compte Clerk
- Surveillez les tentatives de connexion suspectes
- Configurez les webhooks Clerk pour les événements critiques

## 📞 Support

En cas de problème :
1. **Logs Cloudflare** : Pages > Functions > Logs
2. **Logs Clerk** : Dashboard > Events
3. **Documentation** : [clerk.com/docs](https://clerk.com/docs)
4. **Support Clerk** : Dashboard > Help

## 🎯 Migration des Utilisateurs

Si vous avez des utilisateurs existants avec CloudFlare Zero Trust :
1. **Exportez** les données utilisateurs actuelles
2. **Importez** dans Clerk via API ou CSV
3. **Communiquez** le changement aux utilisateurs
4. **Période de transition** avec les deux systèmes si nécessaire