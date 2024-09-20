## Tips
- Client side validations can always be bypassed

## Get Started with Prisma, Neon, Auth.js

1. Run `npm i -D prisma`
2. Run `npm i @prisma/client`
3. Run `touch lib/db.ts`
4. Run `npx prisma init`, it will automatically create `prisma/schema.prisma` file and add DATABASE_URL in the `.env` file.
5. Create new project in [neon.tech](https://console.neon.tech/app/projects) and copy connection strings to `schema.prisma` and `.env` files
6. Add a new `model ModelName {}` in the `schema.prisma` file.
7. Run `npx prisma generate` (`schema.prisma` file must contain definition of generator client.)
8. Run `npx prisma db push` to sync database with your Prisma schema.
9. Run `npm install @auth/prisma-adapter`