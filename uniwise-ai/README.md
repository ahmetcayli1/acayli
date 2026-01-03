# UNIWISE AI - University Matching Platform

<div align="center">
  
🎓 **Advanced Academic Matching Algorithm** 🎯

A comprehensive web application that uses AI to match students with their ideal university programs worldwide.

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Stripe Webhook Setup](#stripe-webhook-setup)
- [Admin Access](#admin-access)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)

---

## 🌟 Overview

UNIWISE AI is a full-stack application that helps students find their perfect university matches for Bachelor's and Master's programs. The platform uses a sophisticated 6-stage AI-powered matching pipeline to analyze student profiles against thousands of university programs across multiple countries.

### Key Capabilities

- **Multi-Stage Matching**: 6-stage pipeline including semantic similarity, rule-based evaluation, and LLM analysis
- **Paywall System**: Preview-first model with Stripe integration for full access
- **Admin Panel**: Complete dataset management and analytics dashboard
- **Dynamic Forms**: 8-step wizard that adapts based on degree level (Bachelor/Master)
- **Real-time Updates**: Auto-save functionality and progress tracking

---

## ✨ Features

### For Students

- ✅ Bachelor's and Master's program matching
- ✅ Multi-country selection (Germany, Italy, Poland + 10 more coming soon)
- ✅ 8-step dynamic profile wizard
- ✅ AI-powered match scoring with admission probability
- ✅ Preview first 3 results for free
- ✅ Full access via one-time payment ($863.64 USD, 64% off)
- ✅ Detailed program analysis with strengths/weaknesses
- ✅ City insights and tuition information

### For Administrators

- ✅ Dataset management (upload, replace, append, delete)
- ✅ User analytics and monitoring
- ✅ Match run inspection
- ✅ Purchase tracking and revenue analytics
- ✅ Program preview and validation

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)

### Backend
- **Next.js API Routes**
- **NextAuth.js** (authentication)
- **Prisma** (ORM)
- **PostgreSQL** (with pgvector extension)

### External Services
- **OpenAI** (embeddings + GPT-4)
- **Stripe** (payments)

### Additional Libraries
- `xlsx` - Excel file processing
- `pdf-parse` - PDF text extraction
- `bcryptjs` - Password hashing
- `zod` - Schema validation

---

## 📦 Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **PostgreSQL** 14+ with `pgvector` extension
- **OpenAI API Key**
- **Stripe Account** (test mode for development)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
cd uniwise-ai
npm install
```

### 2. Install PostgreSQL with pgvector

#### macOS (Homebrew)
```bash
brew install postgresql@14
brew install pgvector
```

#### Ubuntu/Debian
```bash
sudo apt-get install postgresql-14
sudo apt-get install postgresql-14-pgvector
```

#### Docker
```bash
docker run -d \
  --name uniwise-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=uniwise_ai \
  -p 5432:5432 \
  ankane/pgvector
```

### 3. Enable pgvector Extension

```sql
CREATE DATABASE uniwise_ai;
\c uniwise_ai
CREATE EXTENSION vector;
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/uniwise_ai?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-strong-secret-key-here"

# Admin Credentials
ADMIN_EMAIL="admin@uniwise.ai"
ADMIN_PASSWORD="YourSecurePassword123!"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# Pricing (in cents)
CONSULTING_PACKAGE_PRICE=86364
CONSULTING_PACKAGE_LIST_PRICE=239900
CONSULTING_PACKAGE_DISCOUNT=64

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES="application/pdf"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy and paste into `.env`

### Get Stripe Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy the **Secret key** (starts with `sk_test_`)
3. Copy the **Publishable key** (starts with `pk_test_`)

---

## 🗄️ Database Setup

### 1. Generate Prisma Client

```bash
npm run prisma:generate
```

### 2. Push Schema to Database

```bash
npm run db:push
```

Or create a migration:

```bash
npm run db:migrate
```

### 3. Seed Database

The seed script will:
- Create the admin user
- Import sample program data from Excel files
- Generate embeddings for all programs

```bash
npm run db:seed
```

**Note**: The seed process can take 5-10 minutes due to OpenAI API rate limits.

### 4. Verify Data

```bash
npm run db:studio
```

This opens Prisma Studio where you can browse your database.

---

## ▶️ Running the Application

### Development Mode

```bash
npm run dev
```

Visit http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

---

## 💳 Stripe Webhook Setup

### Local Development with Stripe CLI

#### 1. Install Stripe CLI

**macOS**:
```bash
brew install stripe/stripe-cli/stripe
```

**Windows** / **Linux**: Download from https://stripe.com/docs/stripe-cli

#### 2. Login to Stripe

```bash
stripe login
```

#### 3. Forward Webhooks to Local Server

```bash
stripe listen --forward-to localhost:3000/api/billing/webhook
```

This will output a webhook signing secret like `whsec_...`. Copy this to your `.env` file as `STRIPE_WEBHOOK_SECRET`.

#### 4. Test Payment Flow

1. Start the app: `npm run dev`
2. Sign up for a user account
3. Complete the wizard and run matching
4. On the results page, click "Unlock Full Results"
5. Use Stripe test card: `4242 4242 4242 4242`
6. Any future expiry date, any CVC

### Production Webhook Setup

1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://yourdomain.com/api/billing/webhook`
3. Select event: `checkout.session.completed`
4. Copy the signing secret to your production `.env`

---

## 👨‍💼 Admin Access

### Default Admin Credentials

- **Email**: Set in `ADMIN_EMAIL` env variable (default: `admin@uniwise.ai`)
- **Password**: Set in `ADMIN_PASSWORD` env variable

### Admin Features

Once logged in as admin, you can:

1. **Dashboard** (`/admin`)
   - Overview of system statistics
   - Quick access to all admin functions

2. **Datasets** (`/admin/datasets`)
   - View program counts by country and degree level
   - Preview dataset contents
   - Delete datasets

3. **Users** (`/admin/users`)
   - View all registered users
   - See user activity (profiles, matches, purchases)

4. **Match Runs** (`/admin/match-runs`)
   - Inspect all matching runs
   - View detailed results and scores

5. **Purchases** (`/admin/purchases`)
   - Transaction history
   - Revenue tracking

---

## 📁 Project Structure

```
uniwise-ai/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # NextAuth & registration
│   │   ├── admin/             # Admin endpoints
│   │   ├── billing/           # Stripe integration
│   │   ├── profile/           # Profile management
│   │   ├── match/             # Matching pipeline
│   │   └── entitlement/       # Access control
│   ├── admin/                 # Admin pages
│   ├── auth/                  # Sign in/up pages
│   ├── wizard/                # Profile wizard
│   ├── match/                 # Matching progress
│   ├── results/               # Results with paywall
│   ├── payment/               # Payment callbacks
│   ├── dashboard/             # User dashboard
│   └── page.tsx               # Landing page
├── components/
│   └── wizard/                # Wizard components
├── config/
│   ├── constants.ts           # Countries, languages
│   ├── country_test_priority.json
│   └── landing_images.json
├── data/
│   ├── master/                # Master's program Excel files
│   └── bachelor/              # Bachelor's program Excel files
├── lib/
│   ├── prisma.ts              # Prisma client
│   ├── openai.ts              # OpenAI integration
│   ├── stripe.ts              # Stripe configuration
│   ├── auth.ts                # Password hashing
│   ├── matching.ts            # Matching engine
│   └── adminAuth.ts           # Admin middleware
├── prisma/
│   └── schema.prisma          # Database schema
├── scripts/
│   ├── seed.ts                # Database seeder
│   └── create-sample-datasets.ts
├── uploads/                   # User uploads (gitignored)
├── .env                       # Environment variables
└── README.md                  # This file
```

---

## 🔌 API Endpoints

### Public Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handlers
- `POST /api/profile` - Create/update profile
- `GET /api/profile` - Get user profile
- `POST /api/match/run` - Start matching pipeline
- `GET /api/match/:id` - Get match results (limited to 3 without entitlement)
- `GET /api/entitlement` - Check user entitlement

### Billing Endpoints

- `POST /api/billing/create-checkout-session` - Create Stripe checkout
- `POST /api/billing/webhook` - Stripe webhook handler

### Admin Endpoints (ADMIN role required)

- `GET /api/admin/users` - List all users
- `GET /api/admin/datasets` - Get dataset info
- `DELETE /api/admin/datasets` - Delete dataset
- `GET /api/admin/match-runs` - List match runs
- `GET /api/admin/match-runs/:id` - Get match run details
- `GET /api/admin/purchases` - List purchases

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database

Use a managed PostgreSQL service with pgvector support:

- **Supabase** (recommended, has pgvector built-in)
- **Railway**
- **Neon**
- **AWS RDS** (requires manual pgvector setup)

### Environment Variables in Production

Make sure to update:
- `DATABASE_URL` - Production database URL
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - New secret for production
- `STRIPE_SECRET_KEY` - Live key (starts with `sk_live_`)
- `STRIPE_WEBHOOK_SECRET` - Production webhook secret
- All other keys with production values

---

## 📊 Adding New Countries/Programs

### 1. Prepare Excel File

Create an Excel file with these columns:
- `university_name`
- `program_name`
- `language` (english, german, italian, polish, etc.)

Example: `data/master/france_master.xlsx`

### 2. Update Constants

Add the country to `config/constants.ts`:

```typescript
export const COUNTRIES = [
  // ...
  { code: 'FR', name: 'France', flag: '🇫🇷', description: 'Arts and sciences excellence' },
]
```

### 3. Add Test Priority

Update `config/country_test_priority.json`:

```json
{
  "FR": {
    "bachelor": { "required_tests": [], "optional_tests": ["SAT"], "language_tests": ["TOEFL", "IELTS", "DELF"] },
    "master": { "required_tests": [], "optional_tests": ["GRE", "GMAT"], "language_tests": ["TOEFL", "IELTS", "DALF"] }
  }
}
```

### 4. Import Dataset

Update `scripts/seed.ts` to include your new file, then run:

```bash
npm run db:seed
```

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql -U user -d uniwise_ai -h localhost

# Check if pgvector is installed
SELECT * FROM pg_extension WHERE extname = 'vector';
```

### OpenAI API Errors

- Check your API key is correct
- Verify you have credits in your OpenAI account
- Rate limiting: The seed script includes delays

### Stripe Webhook Not Working

- Make sure Stripe CLI is running
- Check webhook secret matches `.env`
- Verify endpoint is `/api/billing/webhook`

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

---

## 📝 License

This project is proprietary software. All rights reserved.

---

## 👥 Support

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review the code comments
- Contact the development team

---

## 🎯 Roadmap

- [ ] PDF upload and parsing functionality
- [ ] Add remaining 10 countries
- [ ] Multi-language support (UI localization)
- [ ] Mobile app
- [ ] Video call consultations
- [ ] Program comparison tool
- [ ] Scholarship database integration

---

<div align="center">

**Built with ❤️ by the UNIWISE Team**

</div>
