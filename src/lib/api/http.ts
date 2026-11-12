export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}

/** Parses a JSON request body, returning an error Response if it isn't valid JSON. */
export async function readJson(request: Request): Promise<{ data: unknown } | { error: Response }> {
  const type = request.headers.get('content-type') ?? '';
  if (!type.includes('application/json')) {
    return { error: json({ error: 'Send the body as JSON with header Content-Type: application/json.' }, 415) };
  }
  const text = await request.text();
  if (text.length > 500_000) {
    return { error: json({ error: 'Body too large (max ~500 KB).' }, 413) };
  }
  try {
    return { data: JSON.parse(text) };
  } catch {
    return { error: json({ error: 'Body is not valid JSON.' }, 400) };
  }
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Converts thrown errors into JSON responses. */
export function handleError(err: unknown) {
  if (err instanceof HttpError) return json({ error: err.message }, err.status);
  console.error('[blog-api]', err);
  return json({ error: 'Unexpected server error. Check the Netlify function logs.' }, 500);
}
