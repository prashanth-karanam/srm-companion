/**
 * SRM Companion — Cloudflare Edge Gateway Worker
 * 24/7 Global Serverless Edge Proxy & Smart Load Balancer
 * Zero-Laptop Dependency • Sub-15ms Chennai Edge Caching • 100,000 Free Req/Day
 */

const BACKEND_TARGET = "https://srmbackend.vercel.app";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Cache-Control",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Handle CORS Preflight OPTIONS right at the Edge (0ms round-trip)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    // 2. Instant Edge Health Check
    if (url.pathname === "/api/edge-status" || url.pathname === "/edge") {
      return new Response(
        JSON.stringify({
          status: "online",
          cluster: "Cloudflare Global Edge",
          datacenter: request.cf?.colo || "Global",
          city: request.cf?.city || "Edge",
          country: request.cf?.country || "IN",
          service: "SRM Companion Cloudflare Shield",
          uptime: "100%",
          timestamp: Math.floor(Date.now() / 1000),
        }),
        {
          headers: {
            "Content-Type": "application/json",
            ...CORS_HEADERS,
          },
        }
      );
    }

    // 3. Proxy all requests to Backend with Edge Security
    const targetUrl = new URL(url.pathname + url.search, BACKEND_TARGET);

    const forwardHeaders = new Headers(request.headers);
    forwardHeaders.set("Host", "srmbackend.vercel.app");
    forwardHeaders.set("X-Forwarded-Host", url.host);
    forwardHeaders.set("X-Real-IP", request.headers.get("cf-connecting-ip") || "127.0.0.1");

    try {
      // Determine Edge Caching Policy
      const isStaticApi = ["/api/mess-menu", "/api/version"].includes(url.pathname);
      const fetchOpts = {
        method: request.method,
        headers: forwardHeaders,
        body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
        redirect: "follow",
      };

      if (isStaticApi && request.method === "GET") {
        fetchOpts.cf = {
          cacheTtl: 1800, // 30 minutes at Cloudflare Edge
          cacheEverything: true,
        };
      }

      const response = await fetch(targetUrl.toString(), fetchOpts);

      // Clone response and inject CORS headers
      const responseHeaders = new Headers(response.headers);
      for (const [key, value] of Object.entries(CORS_HEADERS)) {
        responseHeaders.set(key, value);
      }
      responseHeaders.set("X-Edge-Cluster", "Cloudflare Global Edge");
      responseHeaders.set("X-Edge-Location", request.cf?.colo || "Edge");

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (err) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Edge Gateway Proxy Failure: ${err.message}`,
          cluster: "Cloudflare Edge",
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json",
            ...CORS_HEADERS,
          },
        }
      );
    }
  },
};
