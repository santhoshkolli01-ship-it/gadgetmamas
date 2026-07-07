/**
 * Cloudflare Pages Function — capture newsletter signups
 * Bind a KV namespace named SUBSCRIBERS in Cloudflare Pages settings.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const email = (body.email || '').trim().toLowerCase();

    if (!email || !EMAIL_RE.test(email)) {
      return Response.json(
        { ok: false, error: 'Invalid email address.' },
        { status: 400, headers: JSON_HEADERS }
      );
    }

    const record = {
      email,
      subscribedAt: new Date().toISOString(),
      source: 'gadgetmamas-landing',
      userAgent: context.request.headers.get('User-Agent') || '',
    };

    if (!context.env.SUBSCRIBERS) {
      console.error('SUBSCRIBERS KV namespace is not bound.');
      return Response.json(
        { ok: false, error: 'Signup storage is not configured yet.' },
        { status: 503, headers: JSON_HEADERS }
      );
    }

    const existing = await context.env.SUBSCRIBERS.get(email);
    if (existing) {
      return Response.json(
        { ok: true, alreadySubscribed: true },
        { headers: JSON_HEADERS }
      );
    }

    await context.env.SUBSCRIBERS.put(email, JSON.stringify(record));

    /* Optional: append to a list key for easy export */
    const listRaw = await context.env.SUBSCRIBERS.get('__all_emails__');
    const list = listRaw ? JSON.parse(listRaw) : [];
    if (!list.includes(email)) {
      list.push(email);
      await context.env.SUBSCRIBERS.put('__all_emails__', JSON.stringify(list));
    }

    return Response.json({ ok: true }, { headers: JSON_HEADERS });
  } catch (err) {
    console.error('Subscribe error:', err);
    return Response.json(
      { ok: false, error: 'Something went wrong. Please try again.' },
      { status: 500, headers: JSON_HEADERS }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      ...JSON_HEADERS,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
