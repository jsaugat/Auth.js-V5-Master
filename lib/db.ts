import { PrismaClient } from "@prisma/client";

// Extending the global scope in TypeScript to declare a global 'prisma' variable
declare global {
  var prisma: PrismaClient | undefined;
}

// Exporting the Prisma client instance
//? If 'globalThis.prisma' already exists (typically during hot reload in Next.js development), use that instance
//? Otherwise, create a new instance of PrismaClient
export const db = globalThis.prisma || new PrismaClient();

//? If the environment is not production, store the PrismaClient instance in 'globalThis.prisma'
//? This prevents multiple instances of PrismaClient from being created during Next.js hot-reloads in development
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
