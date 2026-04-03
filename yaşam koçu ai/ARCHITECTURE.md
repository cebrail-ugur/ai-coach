# AI Koç - Architecture Guide

## Project Structure

```
.
├── app/                      # Next.js App Router
│   ├── api/                 # Backend API routes
│   │   ├── chat/           # Chat endpoints
│   │   ├── goals/          # Goal management
│   │   ├── habits/         # Habit tracking
│   │   ├── sessions/       # Coaching sessions
│   │   ├── stripe/         # Payment handling
│   │   └── health/         # Health check
│   ├── (dashboard)/        # Protected routes group
│   │   ├── chat/          # Chat interface
│   │   ├── goals/         # Goals page
│   │   └── habits/        # Habits page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
├── lib/                   # Utilities & helpers
│   ├── anthropic/        # Claude AI integration
│   ├── supabase/         # Database clients
│   ├── error.ts          # Error handling
│   └── utils.ts          # Utility functions
├── types/                # TypeScript definitions
├── clean-ai-coach/       # Legacy folder (being migrated)
├── public/               # Static assets
├── middleware.ts         # Next.js middleware
├── next.config.js        # Next.js config
├── tsconfig.json         # TypeScript config
└── tailwind.config.ts    # Tailwind CSS config
```

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + Context API

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

### AI & Services
- **LLM**: Anthropic Claude API (claude-opus-4-6)
- **Payments**: Stripe
- **Validation**: Zod

### Development Tools
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + TypeScript ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript

## Data Flow

### Chat Flow
1. User sends message in `/dashboard/chat`
2. Message sent to `/api/chat`
3. Server builds coaching context from Supabase
4. Streams response from Claude API
5. Client receives streamed text in real-time
6. Message stored in database

### Goal/Habit Management
1. User creates goal/habit in dashboard
2. POST request to `/api/goals` or `/api/habits`
3. Data validated and stored in Supabase
4. Claude generates breakdown (for goals)
5. UI updated with new data

### Session Summary
1. Chat session ends
2. API automatically summarizes conversation
3. Extracts insights, action items, topics
4. Stores in `coaching_sessions` table
5. Updates user dashboard

## Database Schema

Key tables:
- `users` - User profiles
- `goals` - User goals
- `habits` - Habit tracking
- `coaching_sessions` - Session history
- `chat_messages` - Chat history
- `daily_checkins` - Mood/energy tracking
- `stripe_customers` - Payment info

## Environment Variables

### Required for Development
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
```

### Optional (for payments)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

## Security

- **Input Validation**: Zod schemas for all inputs
- **Environment Variables**: Secrets never exposed to client
- **Row-Level Security**: Supabase RLS policies
- **Headers**: Security headers in middleware
- **CORS**: Configured for development

## Performance Considerations

1. **Streaming Responses**: Chat uses server-sent events
2. **Database Caching**: Use Supabase's built-in caching
3. **Image Optimization**: Next.js Image component
4. **Bundle Splitting**: Dynamic imports for code splitting
5. **Database Queries**: Select only needed fields

## Development Workflow

1. Create feature branch
2. Make changes in isolated components
3. Test locally with `npm run dev`
4. Run type checks: `npm run type-check`
5. Run linter: `npm run lint`
6. Commit with clear messages
7. Create PR for review

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Monitoring & Logging

- API errors logged to console (server-side)
- Client errors caught and reported
- Performance metrics from Next.js Analytics
- Database query performance from Supabase

## Future Improvements

- [ ] Real-time notifications with WebSockets
- [ ] Voice chat integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Offline mode
