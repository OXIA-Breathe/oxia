import { Capacitor } from "@capacitor/core";

/** Custom URL scheme registered in AndroidManifest.xml. */
export const APP_SCHEME = "oxia";

/**
 * Where the email confirmation link should send the user.
 * In the phone app, window.location.origin is the app's internal "localhost",
 * which is unreachable from an email — so we use the app's own link instead.
 */
export const getVerifyEmailRedirect = () =>
  Capacitor.isNativePlatform()
    ? `${APP_SCHEME}://verify-email`
    : `${window.location.origin}/verify-email`;

/** Flags used by the Welcome modal. */
export const WELCOME_PENDING_KEY = "oxia.welcomePending";
export const PREMIUM_INTENT_KEY = "oxia.intent";
