/**
 * Array of routes that are public and do not require authentication.
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/auth/verify-email", // User can change their email from the settings page while being logged in so... this route must be public 
  "/auth/new-password",
];

/**
 * Array of authentication routes.
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
];

/**
 *  Prefix for the API auth routes. @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Default redirect path after login. @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
