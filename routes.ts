/**
 * Array of routes that are public and do not require authentication.
 * @type {string[]}
 */
export const publicRoutes = ["/"];

/**
 * Array of authentication routes.
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
];

/**
 *  Prefix for the API auth routes. @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Default redirect path after login. @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
