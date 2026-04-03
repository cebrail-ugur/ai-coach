# Contributing to AI Koç

## Getting Started

1. **Fork & Clone**
   ```bash
   git clone https://github.com/yourusername/ai-coach.git
   cd ai-coach
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment**
   ```bash
   cp .env.example .env.local
   # Fill in your credentials
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Development Standards

### Code Style
- TypeScript strict mode enabled
- Prettier auto-formatting
- ESLint rules enforced
- camelCase for variables/functions
- PascalCase for components/classes

### Naming Conventions
- Components: `ComponentName.tsx`
- Pages: `page.tsx` (Next.js App Router)
- Utils: `util-name.ts`
- Types: `index.ts` or descriptive name

### Commit Messages
```
type(scope): subject

body (optional)

footer (optional)
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(chat): add streaming response support

Implement server-sent events for real-time chat
- Use TextEncoder for message formatting
- Handle connection cleanup
- Add error boundary

Closes #123
```

## Before Submitting a PR

1. **Branch from main**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Check types**
   ```bash
   npm run type-check
   ```

4. **Lint code**
   ```bash
   npm run lint:fix
   ```

5. **Format code**
   ```bash
   npm run format
   ```

6. **Build**
   ```bash
   npm run build
   ```

## Creating a Pull Request

1. Push to your fork
2. Create PR with:
   - Clear title
   - Description of changes
   - Related issue number (#123)
   - Screenshots (if UI changes)

3. Address review feedback
4. PR will be merged once approved

## Testing

### Unit Tests
```bash
npm test
```

### Specific Test File
```bash
npm test -- file.test.ts
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage
```bash
npm test -- --coverage
```

## Debugging

### VS Code
1. Add breakpoints
2. Run `npm run dev`
3. Open Chrome DevTools (F12)
4. Step through code

### Server Logs
Check terminal output from `npm run dev`

### Supabase Console
Monitor queries and RLS policies at supabase.com

## API Development

### Adding New Endpoint
1. Create `app/api/[feature]/route.ts`
2. Implement GET/POST/PUT/DELETE
3. Add request validation with Zod
4. Handle errors appropriately
5. Test with curl/Postman

Example:
```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const RequestSchema = z.object({
  name: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = RequestSchema.parse(body);
    
    // Your logic here
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}
```

## Database Changes

1. **Create migration** in Supabase console
2. **Document changes** in schema
3. **Update types** in `types/index.ts`
4. **Test queries** locally

## Documentation

- Keep README updated
- Document complex logic
- Add JSDoc for public functions
- Update ARCHITECTURE.md for structural changes

## Questions?

- Check ARCHITECTURE.md
- Search existing issues
- Ask in discussions
- Create new issue if unclear

---

Thank you for contributing! 🚀
