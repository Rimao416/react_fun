# 🏠 Web Landing - Architecture Next.js 14

## 📁 Structure Complète

```
apps/web-landing/
├── 📁 app/                      # App Router Next.js 14
│   ├── (marketing)/             # Route groups - Pages marketing
│   │   ├── page.tsx             # Homepage "/"
│   │   ├── about/
│   │   │   └── page.tsx         # "/about"
│   │   ├── features/
│   │   │   ├── page.tsx         # "/features"
│   │   │   ├── local-services/
│   │   │   │   └── page.tsx     # "/features/local-services"
│   │   │   └── digital-services/
│   │   │       └── page.tsx     # "/features/digital-services"
│   │   ├── pricing/
│   │   │   └── page.tsx         # "/pricing"
│   │   ├── success-stories/
│   │   │   ├── page.tsx         # "/success-stories"
│   │   │   └── [slug]/
│   │   │       └── page.tsx     # "/success-stories/aminata-senegal"
│   │   └── contact/
│   │       └── page.tsx         # "/contact"
│   ├── (auth)/                  # Pages authentification
│   │   ├── login/
│   │   │   └── page.tsx         # "/login"
│   │   ├── register/
│   │   │   ├── page.tsx         # "/register"
│   │   │   ├── freelancer/
│   │   │   │   └── page.tsx     # "/register/freelancer"
│   │   │   └── client/
│   │   │       └── page.tsx     # "/register/client"
│   │   └── forgot-password/
│   │       └── page.tsx         # "/forgot-password"
│   ├── (legal)/                 # Pages légales
│   │   ├── privacy/
│   │   │   └── page.tsx         # "/privacy"
│   │   ├── terms/
│   │   │   └── page.tsx         # "/terms"
│   │   └── cookies/
│   │       └── page.tsx         # "/cookies"
│   ├── (localized)/             # Pages multilingues
│   │   ├── [locale]/
│   │   │   ├── page.tsx         # "/fr", "/en", "/ar"
│   │   │   ├── about/
│   │   │   ├── features/
│   │   │   └── contact/
│   │   └── layout.tsx           # Layout localisé
│   ├── api/                     # API Routes
│   │   ├── auth/
│   │   │   ├── register/
│   │   │   │   └── route.ts     # POST /api/auth/register
│   │   │   └── login/
│   │   │       └── route.ts     # POST /api/auth/login
│   │   ├── contact/
│   │   │   └── route.ts         # POST /api/contact
│   │   ├── newsletter/
│   │   │   └── route.ts         # POST /api/newsletter
│   │   ├── waitlist/
│   │   │   └── route.ts         # POST /api/waitlist
│   │   └── webhooks/
│   │       ├── stripe/
│   │       │   └── route.ts     # Stripe webhooks
│   │       └── mailchimp/
│   │           └── route.ts     # Mailchimp webhooks
│   ├── globals.css              # Styles globaux Tailwind
│   ├── layout.tsx               # Root layout
│   ├── loading.tsx              # Loading UI global
│   ├── error.tsx                # Error boundaries
│   ├── not-found.tsx            # 404 page
│   └── robots.txt               # SEO robots
├── 📁 components/               # Composants React
│   ├── 🎨 ui/                   # Design System (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown.tsx
│   │   ├── accordion.tsx
│   │   ├── tabs.tsx
│   │   ├── carousel.tsx
│   │   ├── tooltip.tsx
│   │   └── index.ts             # Barrel exports
│   ├── 📋 forms/                # Formulaires complexes
│   │   ├── ContactForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── LoginForm.tsx
│   │   ├── WaitlistForm.tsx
│   │   ├── NewsletterForm.tsx
│   │   └── FeedbackForm.tsx
│   ├── 🔒 auth/                 # Composants auth
│   │   ├── SocialLogin.tsx
│   │   ├── AuthModal.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── AuthProvider.tsx
│   └── 🎬 animations/           # Animations Framer Motion
│       ├── FadeIn.tsx
│       ├── SlideUp.tsx
│       ├── StaggerChildren.tsx
│       ├── FloatAnimation.tsx
│       └── PageTransition.tsx
├── 📁 lib/                      # Utilitaires & configurations
│   ├── api/                     # Client API
│   │   ├── client.ts            # Axios setup
│   │   ├── auth.ts              # Auth endpoints
│   │   ├── contact.ts           # Contact endpoints
│   │   ├── newsletter.ts        # Newsletter endpoints
│   │   └── types.ts             # API types
│   ├── auth/                    # Authentification
│   ├── email/                   # Email services
│   │   ├── resend.ts            # Resend API
│   │   ├── templates.ts         # Email templates
│   │   └── newsletter.ts        # Newsletter logic
│   ├── seo/                     # SEO utilities
│   │   ├── metadata.ts          # Meta generation
│   │   ├── schema.ts            # JSON-LD schemas
│   │   ├── sitemap.ts           # Sitemap generation
│   │   └── robots.ts            # Robots.txt
│   ├── i18n/                    # Internationalisation
│   │   ├── config.ts            # i18n configuration
│   │   ├── dictionaries.ts      # Dictionnaires langues
│   │   ├── middleware.ts        # Middleware i18n
│   │   └── utils.ts             # i18n helpers
│   ├── validations/             # Zod schemas
│   │   ├── auth.ts              # Auth validation
│   │   ├── contact.ts           # Contact validation
│   │   ├── newsletter.ts        # Newsletter validation
│   │   └── common.ts            # Common schemas
│   ├── utils/                   # Utilitaires généraux
│   │   ├── cn.ts                # Class name utility
│   │   ├── fonts.ts             # Font definitions
│   │   ├── constants.ts         # App constants
│   │   ├── format.ts            # Formatters
│   │   └── helpers.ts           # Helper functions
│   └── hooks/                   # Custom hooks
│       ├── useAuth.ts
│       ├── useLocalStorage.ts
│       ├── useDebounce.ts
│       ├── useIntersection.ts
│       ├── useScrollPosition.ts
│       ├── useMediaQuery.ts
│       └── useClickOutside.ts
├── 📁 content/                  # Contenu statique (MDX)
│   ├── blog/                    # Articles de blog
│   │   ├── launch-announcement.mdx
│   │   ├── african-freelance-guide.mdx
│   │   ├── mobile-money-integration.mdx
│   │   └── success-stories.mdx
│   ├── pages/                   # Pages statiques
│   │   ├── about.mdx
│   │   ├── privacy.mdx
│   │   ├── terms.mdx
│   │   └── cookies.mdx
│   ├── testimonials/            # Témoignages
│   │   ├── aminata-senegal.mdx
│   │   ├── koffi-ivoire.mdx
│   │   └── fatima-mali.mdx
│   ├── features/                # Descriptions features
│   │   ├── local-services.mdx
│   │   ├── digital-services.mdx
│   │   ├── mobile-money.mdx
│   │   └── academy.mdx
│   └── faq/                     # Questions fréquentes
│       ├── general.mdx
│       ├── payments.mdx
│       ├── freelancers.mdx
│       └── clients.mdx
├── 📁 data/                     # Données statiques
│   ├── countries.json           # Pays africains supportés
│   ├── testimonials.json        # Témoignages clients
│   ├── features.json            # Liste des fonctionnalités
│   ├── stats.json               # Statistiques platform
│   ├── pricing.json             # Plans tarifaires
│   ├── team.json                # Équipe Siyé
│   ├── partners.json            # Partenaires
│   ├── faqs.json                # FAQ structurée
│   └── translations/            # Traductions i18n
│       ├── fr.json
│       ├── en.json
│       ├── ar.json
│       ├── wo.json              # Wolof (Sénégal)
│       └── bm.json              # Bambara (Mali)
├── 📁 styles/                   # Styles CSS
│   ├── globals.css              # Styles Tailwind globaux
│   ├── components.css           # Styles composants custom
│   ├── animations.css           # Animations CSS custom
│   ├── fonts.css                # Font faces custom
│   └── print.css                # Styles impression
├── 📁 public/                   # Assets statiques
│   ├── images/
│   ├── icons/
│   ├── manifest.json            # PWA manifest
│   ├── robots.txt               # SEO robots
│   └── sitemap.xml              # SEO sitemap
├── 📁 __tests__/                # Tests
│   ├── components/
│   │   ├── ui/
│   │   ├── marketing/
│   │   └── forms/
│   ├── pages/
│   ├── api/
│   ├── utils/
│   ├── e2e/                     # Tests Playwright E2E
│   └── fixtures/                # Test data
│       ├── users.json
│       ├── testimonials.json
│       └── countries.json
├── 📁 .storybook/               # Storybook config
│   ├── main.ts
│   ├── preview.ts
│   └── theme.ts
├── ⚙️ Configuration Files
├── 📦 package.json
├── 🏗️ tsconfig.json
├── 🎨 tailwind.config.js
├── 📋 next.config.js
├── 🔧 eslint.config.js
├── 🎭 prettier.config.js
├── 🧪 jest.config.js
├── 🎪 playwright.config.ts
├── 🔒 middleware.ts             # Next.js middleware
├── 📊 instrumentation.ts        # Observability setup
└── 📖 README.md
```
