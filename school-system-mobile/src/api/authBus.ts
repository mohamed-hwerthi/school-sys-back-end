/**
 * Tiny pub/sub used to let the axios interceptor signal AuthContext when
 * a token-refresh attempt has failed for good — so we can force a clean
 * logout (clear state, send the user back to the login screen).
 *
 * Lives outside React so non-React code (axios interceptors) can emit.
 */

type Listener = () => void;

const listeners = new Set<Listener>();

/** Subscribe to the "force logout" signal. Returns an unsubscribe function. */
export function onForceLogout(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Notify all subscribers that the session is no longer valid. */
export function emitForceLogout(): void {
  for (const l of listeners) {
    try {
      l();
    } catch {
      /* never let one listener break the others */
    }
  }
}
