# Contributing Guide

Thank you for your interest in contributing to this project! This guide will help you get started with development.

## Development Setup

### Prerequisites

- [Bun](https://bun.sh) v1.0+ (recommended) or Node.js v18+
- Git
- A code editor (VS Code recommended)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/aws-sam-auth0-dynamo.git
   cd aws-sam-auth0-dynamo
   ```

2. **Install dependencies**
   
   With Bun (recommended):
   ```bash
   bun install
   ```
   
   With npm:
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your development credentials.

4. **Build all packages**
   ```bash
   npm run build
   ```

## Project Structure

```
.
├── packages/
│   ├── api/              # Main API server
│   │   ├── src/
│   │   │   └── index.ts  # API entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── auth/             # Auth0 authentication
│   │   ├── src/
│   │   │   └── index.ts  # Auth middleware
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── db/               # Supabase database
│       ├── src/
│       │   ├── index.ts  # DB client
│       │   ├── migrations/
│       │   └── seed.ts
│       ├── package.json
│       └── tsconfig.json
├── package.json          # Root workspace config
└── README.md
```

## Development Workflow

### Running the Development Server

With Bun:
```bash
bun run dev:bun
```

With Node.js:
```bash
npm run dev
```

The server will start with auto-reload enabled on port 3000.

### Building

Build all packages:
```bash
npm run build
```

Build a specific package:
```bash
npm run build --workspace=packages/api
```

### Testing

The API can be tested using curl:

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test root endpoint
curl http://localhost:3000/

# Test protected endpoint (should return 401)
curl http://localhost:3000/api/profile
```

## Making Changes

### Adding a New API Endpoint

1. Open `packages/api/src/index.ts`
2. Add your route:

```typescript
app.get('/api/your-endpoint', async (c) => {
  // Your logic here
  return c.json({ message: 'Hello' });
});
```

3. For protected routes, they must be under `/api/*` (Auth middleware is already applied)

### Adding Database Operations

1. Open `packages/db/src/index.ts`
2. Add helper functions:

```typescript
export async function getUser(userId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
}
```

3. Use in your API:

```typescript
import { getUser } from '@aws-sam-auth0-dynamo/db';

app.get('/api/user', async (c) => {
  const user = c.get('user');
  const userData = await getUser(user.sub);
  return c.json({ data: userData });
});
```

### Creating Database Migrations

1. Create a new SQL file in `packages/db/src/migrations/`
2. Name it with a number prefix (e.g., `002_add_users_table.sql`)
3. Write your SQL:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

4. Run it in Supabase SQL Editor

### Modifying Authentication

The auth middleware is in `packages/auth/src/index.ts`.

To customize authentication:

```typescript
// Add custom claims validation
export const authMiddleware = async (c: Context, next: Next) => {
  // ... existing code ...
  
  // Custom validation
  if (!payload.email_verified) {
    return c.json({ error: 'Email not verified' }, 403);
  }
  
  await next();
};
```

## Code Style

### TypeScript Guidelines

- Use TypeScript for all new code
- Enable strict mode (already configured)
- Define types for API responses
- Use interfaces for data structures

Example:

```typescript
interface UserResponse {
  id: string;
  email: string;
  name: string;
}

app.get('/api/user', async (c): Promise<Response> => {
  const data: UserResponse = {
    id: '123',
    email: 'user@example.com',
    name: 'User'
  };
  return c.json(data);
});
```

### Naming Conventions

- Use camelCase for variables and functions
- Use PascalCase for types and interfaces
- Use UPPER_CASE for environment variables
- Use kebab-case for file names

### Error Handling

Always handle errors properly:

```typescript
app.get('/api/data', async (c) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('table')
      .select('*');
    
    if (error) {
      console.error('Database error:', error);
      return c.json({ error: 'Failed to fetch data' }, 500);
    }
    
    return c.json({ data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});
```

## Commit Guidelines

### Commit Message Format

Follow conventional commits:

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:

```
feat(api): add user profile endpoint

Add GET /api/profile endpoint to retrieve user information
from Supabase based on Auth0 token.

Closes #123
```

```
fix(auth): handle expired tokens gracefully

Previously expired tokens would cause server errors.
Now returns 401 with appropriate error message.
```

### Branching Strategy

- `main`: Production-ready code
- `develop`: Development branch
- `feature/your-feature`: New features
- `fix/your-fix`: Bug fixes

Workflow:

1. Create a branch from `develop`
   ```bash
   git checkout -b feature/my-feature develop
   ```

2. Make your changes and commit
   ```bash
   git add .
   git commit -m "feat(api): add my feature"
   ```

3. Push and create a pull request
   ```bash
   git push origin feature/my-feature
   ```

## Pull Request Process

1. **Update documentation** if needed
2. **Test your changes** thoroughly
3. **Build successfully**: Run `npm run build`
4. **Write clear PR description** explaining:
   - What changes were made
   - Why they were necessary
   - How to test them
5. **Link related issues**
6. **Wait for review** and address feedback

## Testing Checklist

Before submitting a PR:

- [ ] Code builds successfully (`npm run build`)
- [ ] Server starts without errors (`npm run start`)
- [ ] All endpoints return expected responses
- [ ] Protected routes require authentication
- [ ] No sensitive data in logs or responses
- [ ] Environment variables documented if added
- [ ] Documentation updated if needed

## Common Tasks

### Adding a New Dependency

1. Navigate to the package directory
   ```bash
   cd packages/api
   ```

2. Install the dependency
   ```bash
   npm install package-name
   ```

3. Use in your code:
   ```typescript
   import { something } from 'package-name';
   ```

### Updating Dependencies

```bash
npm update
```

For major updates, check breaking changes first.

### Debugging

#### Using Node.js Inspector

```bash
node --inspect dist/index.js
```

Then open `chrome://inspect` in Chrome.

#### Logging

Use console methods for debugging:

```typescript
console.log('Debug info:', data);
console.error('Error occurred:', error);
console.warn('Warning:', message);
```

For production, consider using a proper logging library.

## Getting Help

- **Documentation**: Check README.md and DEPLOYMENT.md
- **Issues**: Search existing GitHub issues
- **Questions**: Open a discussion on GitHub
- **Bugs**: Open an issue with reproduction steps

## License

By contributing, you agree that your contributions will be licensed under the project's license.
