## Tips

- Client side validations can always be bypassed.
- Middleware works in the edge, can't use prisma in `middleware.ts` file.

## Get Started with Prisma, Neon

1. Run `npm i -D prisma`
2. Run `npm i @prisma/client`
3. Run `touch lib/db.ts`
4. Run `npx prisma init`, it will automatically create `prisma/schema.prisma` file and add DATABASE_URL in the `.env` file.
5. Create new project in [neon.tech](https://console.neon.tech/app/projects) and copy connection strings to `schema.prisma` and `.env` files
6. Add a new `model ModelName {}` in the `schema.prisma` file.
7. Run `npx prisma generate` (`schema.prisma` file must contain definition of generator client.)
8. Run `npx prisma db push` to sync database with your Prisma schema.
9. Run `npm install @auth/prisma-adapter`

### Prisma Tips:

- Run studio server - `npx prisma studio`
- Reset database - `npx prisma migrate reset` (Avoid doing this in production)

## Get Started with Auth.js

1. Follow the [Auth.js](https://authjs.dev/getting-started/installation) docs commands.
2. Vist http://localhost:3000/api/auth/providers to check the providers being used.





- create sendVerificationEmail 