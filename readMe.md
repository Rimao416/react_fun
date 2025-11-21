# 🔐 User Service - Architecture Complète

## 📁 Structure du Projet

```
services/user-service/
├── src/
│   ├── config/                 # Configuration
│   │   ├── database.ts         # Prisma client
│   │   ├── redis.ts            # Redis client
│   │   ├── env.ts              # Variables d'environnement
│   │   └── aws.ts              # AWS S3 config
│   │
│   ├── modules/                # Modules métier
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.middleware.ts
│   │   │   └── auth.dto.ts
│   │   │
│   │   ├── users/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.routes.ts
│   │   │   └── user.dto.ts
│   │   │
│   │   ├── profile/
│   │   │   ├── profile.controller.ts
│   │   │   ├── profile.service.ts
│   │   │   ├── profile.routes.ts
│   │   │   └── profile.dto.ts
│   │   │
│   │   ├── reputation/
│   │   │   ├── reputation.controller.ts
│   │   │   ├── reputation.service.ts
│   │   │   ├── reputation.routes.ts
│   │   │   └── reputation.dto.ts
│   │   │
│   │   ├── onboarding/
│   │   │   ├── onboarding.controller.ts
│   │   │   ├── onboarding.service.ts
│   │   │   ├── onboarding.routes.ts
│   │   │   └── onboarding.dto.ts
│   │   │
│   │   └── reference/
│   │       ├── reference.controller.ts
│   │       ├── reference.service.ts
│   │       └── reference.routes.ts
│   │
│   ├── shared/                 # Code partagé
│   │   ├── middlewares/
│   │   │   ├── error-handler.ts
│   │   │   ├── validate.ts
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rate-limit.ts
│   │   │   ├── upload.middleware.ts
│   │   │   ├── logger.ts
│   │   │   └── requireOnboarding.middleware.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.utils.ts
│   │   │   ├── hash.utils.ts
│   │   │   ├── email.utils.ts
│   │   │   └── errors.ts
│   │   │
│   │   ├── services/
│   │   │   ├── upload.service.ts
│   │   │   └── reference-data.service.ts
│   │   │
│   │   └── types/
│   │       ├── express.d.ts
│   │       └── common.types.ts
│   │
│   ├── prisma/                 # Prisma schema
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seeds/
│   │       └── onboarding.seed.ts
│   │
│   ├── app.ts                  # Express app
│   └── server.ts               # Entry point
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── package.json
├── Dockerfile
└── docker-compose.yml
```

---

## 🔌 TOUS LES ENDPOINTS DISPONIBLES

### Base URL: `http://localhost:3001/api/v1`

---

## 🔐 MODULE AUTH - `/auth`

### Authentification

#### 1. Inscription
```http
POST /auth/register
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+221771234567",
  "country": "SN",
  "role": "CLIENT" | "FREELANCER"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "user": {
      "id": "cuid...",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CLIENT",
      "emailVerified": false,
      ...
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  },
  "message": "Inscription réussie. Vérifiez votre email."
}
```

#### 2. Connexion
```http
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  },
  "message": "Connexion réussie"
}
```

#### 3. Rafraîchir le token
```http
POST /auth/refresh
Content-Type: application/json

Body:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response: 200 OK
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### 4. Déconnexion
```http
POST /auth/logout
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response: 200 OK
{
  "success": true,
  "data": {
    "message": "Déconnexion réussie"
  }
}
```

#### 5. Déconnexion tous appareils
```http
POST /auth/logout-all
Authorization: Bearer <access_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "message": "Déconnexion de tous les appareils réussie"
  }
}
```

---

### Vérification Email

#### 6. Vérifier email
```http
GET /auth/verify-email/:token

Response: 200 OK
{
  "success": true,
  "data": {
    "message": "Email vérifié avec succès",
    "emailVerified": true
  }
}
```

#### 7. Renvoyer email de vérification
```http
POST /auth/resend-verification
Content-Type: application/json

Body:
{
  "email": "user@example.com"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "message": "Email de vérification renvoyé avec succès"
  }
}
```

#### 8. Statut vérification email
```http
GET /auth/verification-status
Authorization: Bearer <access_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "verified": true
  }
}
```

---

### Réinitialisation Mot de Passe

#### 9. Mot de passe oublié
```http
POST /auth/forgot-password
Content-Type: application/json

Body:
{
  "email": "user@example.com"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "message": "Si un compte existe, un email a été envoyé"
  }
}
```

#### 10. Réinitialiser mot de passe
```http
POST /auth/reset-password/:token
Content-Type: application/json

Body:
{
  "password": "NewSecurePass123"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "message": "Mot de passe réinitialisé avec succès"
  }
}
```

#### 11. Changer mot de passe
```http
POST /auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
{
  "oldPassword": "OldPass123",
  "newPassword": "NewPass123"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "message": "Mot de passe changé avec succès"
  }
}
```

---

### Profil & Sessions

#### 12. Récupérer mon profil
```http
GET /auth/me
Authorization: Bearer <access_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "cuid...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://...",
    "role": "CLIENT",
    "emailVerified": true,
    "profile": { ... },
    "reputation": { ... }
  }
}
```

#### 13. Sessions actives
```http
GET /auth/sessions
Authorization: Bearer <access_token>

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "session_id",
      "createdAt": "2024-01-15T10:30:00Z",
      "expiresAt": "2024-01-22T10:30:00Z",
      "isExpired": false
    }
  ]
}
```

#### 14. Supprimer une session
```http
DELETE /auth/sessions/:sessionId
Authorization: Bearer <access_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "message": "Session supprimée avec succès"
  }
}
```

---

## 👤 MODULE USERS - `/users`

#### 15. Mon profil (alias /auth/me)
```http
GET /users/me
Authorization: Bearer <access_token>

Response: 200 OK
{
  "success": true,
  "data": { ... }
}
```

#### 16. Récupérer un utilisateur
```http
GET /users/:id
Authorization: Bearer <access_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://...",
    "profile": { ... },
    "reputation": { ... }
  }
}
```

#### 17. Liste des utilisateurs (Admin)
```http
GET /users?page=1&limit=20&role=FREELANCER&country=SN&search=john
Authorization: Bearer <admin_token>

Query params:
- page: number (default: 1)
- limit: number (default: 20)
- role: CLIENT | FREELANCER | ADMIN
- status: ACTIVE | INACTIVE | SUSPENDED | BANNED
- country: string
- search: string

Response: 200 OK
{
  "success": true,
  "data": {
    "users": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

#### 18. Mettre à jour mon profil
```http
PATCH /users/me
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "phone": "+221771234567",
  "country": "SN",
  "language": "fr"
}

Response: 200 OK
{
  "success": true,
  "data": { ... },
  "message": "Profil mis à jour"
}
```

#### 19. Mettre à jour profil professionnel
```http
PATCH /users/profile
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
{
  "bio": "Développeur passionné...",
  "skills": ["web_dev", "mobile_dev"],
  "hourlyRate": 15000,
  "portfolio": { ... }
}

Response: 200 OK
{
  "success": true,
  "data": { ... },
  "message": "Profil professionnel mis à jour"
}
```

#### 20. Upload avatar
```http
POST /users/avatar
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Body: FormData
- avatar: File (image)

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "user_id",
    "avatar": "https://bucket.s3.amazonaws.com/avatars/..."
  },
  "message": "Avatar mis à jour"
}
```

#### 21. Supprimer mon compte
```http
DELETE /users/me
Authorization: Bearer <access_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "message": "Compte supprimé avec succès"
  }
}
```

#### 22. Statistiques utilisateur
```http
GET /users/stats
Authorization: Bearer <access_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "reputation": { ... },
    "missions": {
      "total": 45,
      "completed": 40,
      "inProgress": 5
    }
  }
}
```

---

## 📋 MODULE ONBOARDING - `/onboarding`

#### 23. Initialiser onboarding
```http
POST /onboarding/initialize
Authorization: Bearer <access_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "message": "Onboarding initialisé",
    "currentStep": 1,
    "data": { ... }
  }
}
```

#### 24. Récupérer progression
```http
GET /onboarding/progress
Authorization: Bearer <access_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "progress_id",
    "currentStep": 3,
    "completedSteps": [1, 2],
    "isCompleted": false,
    "formData": { ... }
  }
}
```

#### 25. Étape 1 - Parcours
```http
POST /onboarding/step-1
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
{
  "serviceType": "LOCAL" | "DIGITAL" | "BOTH"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "message": "Étape 1 sauvegardée",
    "currentStep": 2,
    "progress": 10
  }
}
```

#### 26. Étape 2 - Localisation
```http
POST /onboarding/step-2
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
{
  "country": "SN",
  "city": "Dakar",
  "district": "Plateau",
  "canTravel": true,
  "maxDistance": 10
}

Response: 200 OK
```

#### 27. Étape 3 - Expérience
```http
POST /onboarding/step-3
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
{
  "experienceLevel": "BEGINNER" | "EXPERIENCED" | "EXPERT"
}

Response: 200 OK
```

#### 28. Étape 4 - Objectif
```http
POST /onboarding/step-4
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
{
  "goal": "MAIN_INCOME" | "SIDE_INCOME" | "BUILD_BUSINESS" | "LEARN_SKILLS"
}

Response: 200 OK
```

#### 29. Étape 5 - Compétences
```http
POST /onboarding/step-5
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
{
  "selectedSkills": ["web_dev", "mobile_dev", "ui_ux"],
  "categories": ["development", "design"]
}

Response: 200 OK
```

#### 30. Étape 6 - Éducation
```http
POST /onboarding/step-6
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
{
  "educationLevel": "UNIVERSITY",
  "fieldOfStudy": "Informatique"
}

Response: 200 OK
```

#### 31. Étape 7 - Langues
```http
POST /onboarding/step-7
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
{
  "languages": [
    {
      "code": "fr",
      "name": "Français",
      "level": "NATIVE" | "FLUENT" | "INTERMEDIATE" | "BEGINNER"
    },
    {
      "code": "en",
      "name": "English",
      "level": "FLUENT"
    }
  ]
}

Response: 200 OK
```

#### 32. Étape 8 - Disponibilité
```http
POST /onboarding/step-8
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
{
  "availability": ["MORNING", "AFTERNOON", "FLEXIBLE"],
  "hoursPerWeek": 40
}

Response: 200 OK
```

#### 33. Étape 9 - Contact & Paiement
```http
POST /onboarding/step-9
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
{
  "phone": "+221771234567",
  "whatsappNumber": "+221771234567",
  "paymentMethod": "MOBILE_MONEY" | "BANK_ACCOUNT" | "CASH",
  "paymentDetails": {
    "provider": "Orange Money",
    "accountNumber": "771234567"
  },
  "emergencyContact": {
    "name": "Fatou Diallo",
    "phone": "+221779876543"
  }
}

Response: 200 OK
```

#### 34. Étape 10 - Photo & Bio
```http
POST /onboarding/step-10
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
{
  "bio": "Développeur web passionné...",
  "skipForNow": false
}

Response: 200 OK
```

#### 35. Upload avatar (onboarding)
```http
POST /onboarding/upload-avatar
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Body: FormData
- avatar: File

Response: 200 OK
{
  "success": true,
  "data": {
    "url": "https://...",
    "filename": "avatars/user_id/..."
  },
  "message": "Avatar uploadé avec succès"
}
```

#### 36. Finaliser onboarding
```http
POST /onboarding/complete
Authorization: Bearer <access_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "message": "Onboarding terminé avec succès !",
    "completed": true
  }
}
```

#### 37. Navigation étapes
```http
PATCH /onboarding/go-to-step/:step
Authorization: Bearer <access_token>

Params:
- step: number (1-10)

Response: 200 OK
{
  "success": true,
  "data": {
    "message": "Navigation vers étape 5",
    "currentStep": 5
  }
}
```

---

## 📚 MODULE REFERENCE - `/reference`

#### 38. Catégories services locaux
```http
GET /reference/categories/local

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "cleaning",
      "name": "🧹 Ménage & Nettoyage",
      "description": "Nettoyage de maisons, bureaux...",
      "skills": [
        {
          "id": "home_cleaning",
          "name": "Ménage résidentiel"
        }
      ]
    }
  ]
}
```

#### 39. Catégories services digitaux
```http
GET /reference/categories/digital

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "design",
      "name": "🎨 Design & Création",
      "description": "Graphisme, logos...",
      "skills": [ ... ]
    }
  ]
}
```

#### 40. Liste des langues
```http
GET /reference/languages

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "code": "fr",
      "name": "Français",
      "flag": "🇫🇷"
    },
    {
      "code": "wo",
      "name": "Wolof",
      "flag": "🇸🇳",
      "region": "West Africa"
    }
  ]
}
```

#### 41. Liste des pays
```http
GET /reference/countries

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "code": "SN",
      "name": "Sénégal",
      "flag": "🇸🇳",
      "region": "West",
      "cities": ["Dakar", "Thiès", "Saint-Louis"]
    }
  ]
}
```

#### 42. Clear cache (Admin)
```http
DELETE /reference/cache
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "success": true,
  "data": {
    "message": "Cache cleared"
  }
}
```

---

## 🏥 HEALTH & MONITORING

#### 43. Health Check
```http
GET /health

Response: 200 OK
{
  "status": "ok",
  "service": "user-service"
}
```

---

## 📊 RÉSUMÉ DES ENDPOINTS

### Par Module

| Module | Endpoints | Description |
|--------|-----------|-------------|
| **Auth** | 14 | Authentification, email, password, sessions |
| **Users** | 8 | Gestion profil, CRUD utilisateurs |
| **Onboarding** | 15 | Flow inscription en 10 étapes |
| **Reference** | 5 | Données de référence (catégories, langues, pays) |
| **Health** | 1 | Monitoring |
| **TOTAL** | **43** | |

### Par Type d'Accès

| Type | Count | Description |
|------|-------|-------------|
| Public | 7 | Register, login, forgot password, verify email |
| Protected | 35 | Nécessitent authentification |
| Admin | 2 | Liste users, clear cache |

---

## 🔒 SÉCURITÉ

### Headers requis

```http
# Pour routes protégées
Authorization: Bearer <access_token>

# Pour upload de fichiers
Content-Type: multipart/form-data

# Pour JSON
Content-Type: application/json
```

### Rate Limiting

| Endpoint | Limite |
|----------|--------|
| `/auth/login` | 5 req / 15 min |
| `/auth/register` | 5 req / 15 min |
| `/auth/forgot-password` | 5 req / 15 min |
| `/auth/resend-verification` | 5 req / 15 min |
| Autres | 100 req / 15 min |

---

## 🧪 EXEMPLES D'UTILISATION

### Flow complet d'inscription

```bash
# 1. Register
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe",
    "country": "SN",
    "role": "FREELANCER"
  }'

# 2. Verify email
curl http://localhost:3001/api/v1/auth/verify-email/{token}

# 3. Initialize onboarding
curl -X POST http://localhost:3001/api/v1/onboarding/initialize \
  -H "Authorization: Bearer {token}"

# 4. Complete steps 1-10
curl -X POST http://localhost:3001/api/v1/onboarding/step-1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"serviceType": "DIGITAL"}'

# 5. Finalize
curl -X POST http://localhost:3001/api/v1/onboarding/complete \
  -H "Authorization: Bearer {token}"
```

---

## 🚀 PROCHAINES ÉTAPES

1. **Module Profile** avancé (portfolio, certifications)
2. **Module Reputation** (reviews, ratings)
3. **Module Missions** (créer, postuler, matching)
4. **Module Notifications** (push, email, SMS)
5. **Module Payments** (Mobile Money, escrow)

---

## 📞 SUPPORT

- Email: support@siye.com
- Documentation: https://docs.siye.com
- API Status: https://status.siye.com