/**
 * Shared structured logging for the subscription Edge Functions.
 *
 * Every log line is a single-line JSON object containing at least
 * `trace_id`, `fn`, `step` and `message`, so QA can filter the Supabase
 * function logs by one trace ID and see the whole request end to end.
 *
 * Never log raw receipts, purchase tokens, JWTs, service-account material or
 * emails. Use `fingerprint()` when a token needs to be correlated.
 */

export interface Logger {
  traceId: string;
  /** Informational step. */
  log: (step: string, extra?: Record<string, unknown>) => void;
  /** Failure step. */
  logError: (step: string, extra?: Record<string, unknown>) => void;
  /** Successful JSON response (traceId always included). */
  ok: (body: Record<string, unknown>, status?: number) => Response;
  /** Error JSON response with a stable machine-readable code. */
  fail: (
    code: string,
    status: number,
    message: string,
    extra?: Record<string, unknown>,
  ) => Response;
  /** Milliseconds since the logger was created. */
  elapsedMs: () => number;
}

/** Last 6 characters of a token — enough to correlate, useless to an attacker. */
export function fingerprint(value?: string | null): string | null {
  if (!value) return null;
  return `…${String(value).slice(-6)}`;
}

export function createLogger(
  fn: string,
  extraHeaders: Record<string, string> = {},
): Logger {
  const traceId = crypto.randomUUID();
  const startedAt = Date.now();

  const headers = { ...extraHeaders, "Content-Type": "application/json" };

  const emit = (
    level: "info" | "error",
    step: string,
    extra?: Record<string, unknown>,
  ) => {
    const line = JSON.stringify({
      level,
      trace_id: traceId,
      fn,
      step,
      elapsed_ms: Date.now() - startedAt,
      ...extra,
    });
    if (level === "error") console.error(line);
    else console.log(line);
  };

  return {
    traceId,
    log: (step, extra) => emit("info", step, extra),
    logError: (step, extra) => emit("error", step, extra),
    elapsedMs: () => Date.now() - startedAt,
    ok: (body, status = 200) =>
      new Response(JSON.stringify({ ...body, traceId }), { status, headers }),
    fail: (code, status, message, extra) => {
      emit(status >= 500 ? "error" : "info", "request_failed", {
        code,
        status,
        message,
        ...extra,
      });
      // Diagnostic extras stay in the logs only — the client gets the stable
      // code, a friendly message and the trace ID to quote in a bug report.
      return new Response(
        JSON.stringify({ error: message, code, traceId }),
        { status, headers },
      );
    },
  };
}
