# Sélection Pinard Noël 2025

Plateforme d'achat groupé de caisses de vins pour Noël.

## 🚀 Déploiement

### 1. Supabase
1. Créer un projet sur [supabase.com](https://supabase.com)
2. Aller dans **SQL Editor**
3. Copier/coller le contenu de `supabase-schema.sql`
4. Exécuter → Les 6 cartons avec leurs vins seront créés

### 2. Vercel
1. Connecter le repo GitHub
2. Ajouter les **Environment Variables** :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
GMAIL_USER=julien@optimhub.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
ADMIN_PASSWORD=Pinard25!
NEXT_PUBLIC_BASE_URL=https://votre-site.vercel.app
```

3. Déployer

## 📦 Structure

```
/pages
  /admin
    login.js    → Page de connexion admin
    index.js    → Dashboard admin
  /api
    /admin
      auth.js       → Authentification admin
      cartons.js    → CRUD cartons
      intentions.js → CRUD intentions
      stats.js      → Statistiques
    cartons.js   → API publique cartons
    counts.js    → Compteurs intentions
    intention.js → Enregistrer une intention
  index.js      → Page publique
```

## 🔐 Administration

- URL : `/admin/login`
- Mot de passe : défini dans `ADMIN_PASSWORD`

### Fonctionnalités admin :
- 📊 Dashboard avec statistiques
- 📝 Gestion des intentions
- 📦 Gestion des cartons (créer, modifier, supprimer)
- 👥 Liste des clients

## 🍷 Cartons inclus

| Caisse | Prix | Type |
|--------|------|------|
| Bordeaux Découverte | 90€ | Rouge |
| Bordeaux Prestige | 210€ | Rouge |
| Bourgogne Blanc Découverte | 120€ | Blanc |
| Bourgogne Blanc Prestige | 210€ | Blanc |
| Bourgogne Rouge Découverte | 130€ | Rouge |
| Bourgogne Rouge Prestige | 240€ | Rouge |

## 📧 Notifications email

- Confirmation au client lors de l'intention
- Notification à l'admin
- Email quand 3 personnes intéressées

---

🍷 Sélection par François
