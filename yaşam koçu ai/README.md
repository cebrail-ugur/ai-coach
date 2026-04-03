# AI Coach - Life Coaching Application

AI-powered life coaching platform with habit tracking, goal management, and personalized coaching through advanced AI.

## 🚀 Features

- **AI-Powered Chat**: Real-time coaching conversations using Anthropic's Claude API
- **Habit Tracking**: Build and maintain positive habits with progress tracking
- **Goal Management**: Set, track, and achieve your life goals
- **Personalized Sessions**: Track coaching sessions and progress metrics
- **Payment Integration**: Stripe integration for premium features

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API
- **Payments**: Stripe
- **Validation**: Zod
- **Testing**: Jest + React Testing Library

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Supabase account
- Anthropic API key
- Stripe account (for payment features)

## ⚙️ Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Fill in the values for:
   - `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` & `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`

3. **Database setup**:
   - Run migrations from `clean-ai-coach/supabase/schema.sql` in your Supabase console

4. **Development**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
├── app/                    # Next.js App Router pages & layouts
│   ├── api/               # API routes
│   ├── (dashboard)/       # Protected dashboard routes
│   └── layout.tsx         # Root layout
├── clean-ai-coach/        # Legacy/migration folder
│   ├── components/        # React components
│   ├── lib/              # Utilities & integrations
│   ├── types/            # TypeScript type definitions
│   └── supabase/         # Database schema
├── components/            # Reusable UI components
├── lib/                   # Shared utilities
├── types/                 # Global type definitions
├── tailwind.config.ts     # Tailwind CSS config
├── tsconfig.json          # TypeScript config
└── next.config.js         # Next.js config
```

## 🔑 API Routes

### Chat
- `POST /api/chat` - Send message and get AI response

### Goals
- `GET /api/goals` - List user goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal

### Habits
- `GET /api/habits` - List user habits
- `POST /api/habits` - Create new habit
- `PUT /api/habits/:id` - Update habit

### Sessions
- `POST /api/sessions` - Create coaching session
- `GET /api/sessions` - List sessions

### Stripe
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/webhook` - Handle webhooks

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch
```

## 📝 Code Quality

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## 🚀 Deployment

### Build
```bash
npm run build
```

### Production Server
```bash
npm start
```

### Environment for Production
Set these environment variables on your hosting platform:
- All variables from `.env.example` (except `NEXT_PUBLIC_APP_URL` should be production URL)

## 🔒 Security

- Environment variables properly separated (public vs. secret)
- Stripe webhook signature verification
- Supabase row-level security
- TypeScript for type safety
- Input validation with Zod

## 🐛 Debugging

1. Check console in browser DevTools for client-side errors
2. Check server logs for API errors
3. Verify environment variables are set correctly
4. Check Supabase connection and permissions

## 📚 Documentation

- [Anthropic API Docs](https://docs.anthropic.com)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Stripe Docs](https://stripe.com/docs)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and commit: `git commit -m "feat: add feature"`
3. Push to branch: `git push origin feature/feature-name`
4. Create Pull Request

## 📄 License

Proprietary - All rights reserved

## 👨‍💻 Support

For issues or questions, create an issue in the repository.

---

**Last Updated**: 2026-04-03
