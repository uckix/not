# MiniHackMe

Minimal, sleek learning platform inspired by TryHackMe.

## Tech stack
- Next.js App Router + TypeScript + Tailwind
- Prisma ORM + PostgreSQL (Docker)
- NextAuth (Credentials)
- Markdown rendering with GFM + syntax highlighting

## Local setup

1. Install dependencies

```bash
npm install
```

2. Start Postgres

```bash
docker compose up -d
```

3. Configure environment

```bash
cp .env.example .env
```

4. Run migrations and seed

```bash
npm run prisma:migrate
npm run prisma:seed
```

5. Start dev server

```bash
npm run dev
```

## Admin login
- Email: `admin@local`
- Password: `admin1234`

## Admin workflows
- Visit `/admin` for module/user management.
- Create modules, add pages, upload images in the lesson editor, and manage checkpoints.

## Notes
- Uploaded images are stored in `public/uploads` for the MVP.
- Markdown allows GFM tables, task lists, and code fences with syntax highlighting.
