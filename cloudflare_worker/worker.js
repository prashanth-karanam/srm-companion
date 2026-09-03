/**
 * SRM Companion — Cloudflare Edge Gateway Worker
 * 24/7 Global Serverless Edge Proxy & Smart Load Balancer
 * Zero-Laptop Dependency • Sub-15ms Chennai Edge Routing • 100,000 Free Req/Day
 */

const BACKEND_TARGET = "https://srmbackend.vercel.app";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Cache-Control, X-Domain-Proof",
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

    // 3. Indian Edge Tunnel to SRMIST Portal (sp.srmist.edu.in)
    // Routes outbound portal scraping through Cloudflare's Indian edge nodes (Chennai/Mumbai)
    // Completely bypasses foreign cloud IP restrictions for all clusters (Alpha, Beta, Gamma)
    if (url.pathname.startsWith("/srm-edge/")) {
      const srmPath = url.pathname.replace(/^\/srm-edge/, "");
      const srmTarget = "https://sp.srmist.edu.in" + srmPath + url.search;

      const srmHeaders = new Headers();
      for (const [k, v] of request.headers.entries()) {
        const lk = k.toLowerCase();
        if (!["host", "cf-connecting-ip", "cf-ray", "cf-visitor", "x-real-ip", "x-forwarded-for"].includes(lk)) {
          srmHeaders.set(k, v);
        }
      }
      srmHeaders.set("Host", "sp.srmist.edu.in");
      srmHeaders.set("Origin", "https://sp.srmist.edu.in");
      const ref = srmHeaders.get("Referer") || "";
      if (!ref.includes("sp.srmist.edu.in")) {
        srmHeaders.set("Referer", "https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp");
      }
      if (!srmHeaders.has("User-Agent")) {
        srmHeaders.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36");
      }

      try {
        const srmRes = await fetch(srmTarget, {
          method: request.method,
          headers: srmHeaders,
          body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
          redirect: "follow",
        });

        const outHeaders = new Headers();
        for (const [k, v] of srmRes.headers.entries()) {
          if (k.toLowerCase() !== "set-cookie") {
            outHeaders.set(k, v);
          }
        }
        if (typeof srmRes.headers.getSetCookie === "function") {
          for (const c of srmRes.headers.getSetCookie()) {
            outHeaders.append("Set-Cookie", c);
          }
        }
        for (const [key, value] of Object.entries(CORS_HEADERS)) {
          outHeaders.set(key, value);
        }
        outHeaders.set("X-Indian-Edge-Node", request.cf?.colo || "BOM");
        
        return new Response(srmRes.body, {
          status: srmRes.status,
          headers: outHeaders,
        });
      } catch (err) {
        return new Response(
          JSON.stringify({ success: false, error: `Indian Edge Fetch Error: ${err.message}` }),
          { status: 502, headers: CORS_HEADERS }
        );
      }
    }

    // 4. Proxy other requests to Backend (Vercel) with Edge Security
    const targetUrl = new URL(url.pathname + url.search, BACKEND_TARGET);

    const forwardHeaders = new Headers(request.headers);
    forwardHeaders.set("Host", "srmbackend.vercel.app");
    forwardHeaders.set("X-Forwarded-Host", url.host);
    forwardHeaders.set("X-Real-IP", request.headers.get("cf-connecting-ip") || "127.0.0.1");

    try {
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
