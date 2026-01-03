# UNIWISE AI 🎓

AI-powered university matching platform for international students. Find your perfect Bachelor's or Master's program worldwide.

![UNIWISE AI](https://img.shields.io/badge/UNIWISE-AI-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.2-teal?style=for-the-badge&logo=prisma)

## 🌟 Features

### For Students
- **Multi-country Selection**: Choose from Germany, Italy, Poland (MVP) with 10+ more countries coming soon
- **Smart Profile Wizard**: 5-step guided profile creation with auto-save
- **PDF Parsing**: Upload CV and transcripts for automatic field extraction
- **AI-Powered Matching**: 6-stage matching pipeline with semantic similarity
- **Personalized Results**: Get 10-50 tailored program recommendations
- **Admission Insights**: See acceptance probability, strengths, weaknesses, and expert commentary

### For Admins
- **Dataset Management**: Upload, replace, append, or delete program datasets via Excel
- **User Management**: View all registered users and their activity
- **Match Analytics**: Monitor matching runs and results
- **Purchase Tracking**: View all transactions and entitlements

### Monetization
- **Paywall System**: Preview 3 results free, unlock all with one-time payment
- **Stripe Integration**: Secure checkout with $863.64 (64% off $2,399) pricing
- **Entitlement System**: Automatic access grant upon payment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ with pgvector extension
- Stripe account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd uniwise-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your values
```

4. **Set up the database**
```bash
# Start PostgreSQL (example with Docker)
docker run -d \
  --name uniwise-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=uniwise \
  -p 5432:5432 \
  ankane/pgvector

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

5. **Create sample Excel data**
```bash
npx tsx scripts/create-sample-data.ts
```

6. **Seed the database**
```bash
npm run db:seed
```

7. **Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
uniwise-ai/
├── data/                    # Excel datasets
│   ├── master/             # Master's programs
│   │   ├── germany_master.xlsx
│   │   ├── italy_master.xlsx
│   │   └── poland_master.xlsx
│   └── bachelor/           # Bachelor's programs
│       ├── germany_bachelor.xlsx
│       ├── italy_bachelor.xlsx
│       └── poland_bachelor.xlsx
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seeder
├── public/                 # Static assets
├── scripts/                # Utility scripts
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── admin/         # Admin pages
│   │   ├── api/           # API routes
│   │   ├── auth/          # Auth pages
│   │   ├── match/         # Match wizard
│   │   └── results/       # Results page
│   ├── components/        # React components
│   │   ├── admin/        # Admin components
│   │   ├── landing/      # Landing page components
│   │   ├── results/      # Results components
│   │   ├── ui/           # Base UI components
│   │   └── wizard/       # Wizard components
│   ├── lib/              # Utilities & services
│   │   ├── auth.ts       # NextAuth config
│   │   ├── constants.ts  # App constants
│   │   ├── excel.ts      # Excel processing
│   │   ├── matching.ts   # Matching pipeline
│   │   ├── pdf-parser.ts # PDF parsing
│   │   ├── prisma.ts     # Prisma client
│   │   ├── session.ts    # Session helpers
│   │   ├── stripe.ts     # Stripe config
│   │   └── utils.ts      # General utilities
│   └── types/            # TypeScript types
└── uploads/              # User uploads (gitignored)
```

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/uniwise?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"

# Admin Credentials
ADMIN_EMAIL="admin@uniwise.ai"
ADMIN_PASSWORD="Admin123!@#"

# Stripe
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# Pricing (in cents)
FULL_UNLOCK_PRICE_USD=86364
LIST_PRICE_USD=239900
DISCOUNT_PERCENT=64

# OpenAI (for embeddings - optional for MVP)
OPENAI_API_KEY="sk-xxx"

# File Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE_MB=10
```

## 💳 Stripe Setup

### Test Mode

1. Get your test API keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Add them to your `.env` file

### Webhook (Local Development)

Use Stripe CLI to forward webhooks locally:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# or download from https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/billing/webhook

# Copy the webhook signing secret to .env
# STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Webhook (Production)

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-domain.com/api/billing/webhook`
3. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `charge.refunded`
4. Copy the signing secret to your production environment

## 📊 Excel Dataset Format

Each Excel file should have the following columns:

| Column | Required | Description |
|--------|----------|-------------|
| `university_name` | Yes | Name of the university |
| `program_name` | Yes | Name of the program |
| `language` | Yes | Teaching language (EN, DE, IT, PL, etc.) |
| `description` | No | Program description |
| `keywords` | No | Comma-separated keywords |
| `tuition_info` | No | Tuition fee information |
| `ranking_qs` | No | QS World University Ranking |

### Naming Convention
- `{country}_{level}.xlsx`
- Examples: `germany_master.xlsx`, `italy_bachelor.xlsx`

## 🔐 Authentication

### Roles
- **USER**: Regular users who can create profiles and run matches
- **ADMIN**: Full access to admin panel and all features

### Default Admin
After running the seed script, you can login with:
- Email: `admin@uniwise.ai` (or your `ADMIN_EMAIL`)
- Password: `Admin123!@#` (or your `ADMIN_PASSWORD`)

## 🛣️ API Routes

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/profile` | Create/update profile |
| GET | `/api/profile` | Get current user's profile |
| POST | `/api/documents/parse` | Upload and parse PDF |
| POST | `/api/match/run` | Start matching |
| GET | `/api/match/[runId]` | Get match results |
| GET | `/api/entitlement` | Check user entitlement |

### Billing
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/billing/create-checkout-session` | Create Stripe checkout |
| POST | `/api/billing/webhook` | Stripe webhook handler |

### Admin (requires ADMIN role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/datasets` | Dataset counts |
| POST | `/api/admin/datasets/upload` | Upload Excel dataset |
| POST | `/api/admin/datasets/delete` | Delete dataset |
| GET | `/api/admin/datasets/preview` | Preview dataset |
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/match-runs` | List all match runs |
| GET | `/api/admin/purchases` | List all purchases |

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS + Framer Motion
- **Database**: PostgreSQL + Prisma ORM
- **Vector Search**: pgvector (for semantic matching)
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **PDF Parsing**: pdf-parse
- **Excel Processing**: xlsx

## 📝 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy!

### Docker

```dockerfile
# Coming soon
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- City images from [Unsplash](https://unsplash.com)
- Icons from [Lucide](https://lucide.dev)
- UI inspiration from modern glassmorphism design trends

---

Built with ❤️ for international students worldwide.
