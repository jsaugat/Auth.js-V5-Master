import { db } from "@/lib/db";

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({ where: { token } });
    return twoFactorToken;
  }
  catch (error) {
    console.error("getTwoFactorTokenByToken", error);
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({ where: { email } });
    return twoFactorToken;
  }
  catch (error) {
    console.error("getTwoFactorTokenByEmail", error);
    return null;
  }
};