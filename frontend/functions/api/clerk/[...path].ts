interface Env {
  CLERK_PROXY_URL: string;
  CLERK_FAPI: string;
  CLERK_SECRET_KEY: string;
}

export default {
  async fetch(req: Request, env: Env, _ctx: any): Promise<Response> {
    const url = req.url.replace(env.CLERK_PROXY_URL, env.CLERK_FAPI);
    const proxyReq = new Request(req, {
      redirect: 'manual',
    });

    proxyReq.headers.set('Clerk-Proxy-Url', env.CLERK_PROXY_URL);
    proxyReq.headers.set('Clerk-Secret-Key', env.CLERK_SECRET_KEY);
    proxyReq.headers.set('X-Forwarded-For', req.headers.get('CF-Connecting-IP') || '');

    return fetch(url, proxyReq);
  },
};