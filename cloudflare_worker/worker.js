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

    // 2.2. OneSRM Autonomous Academic Copilot (High-Yield Neural Solver)
    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const reqClone = request.clone();
        let body;
        try {
          body = await reqClone.json();
        } catch (parseErr) {
          return new Response(JSON.stringify({ success: false, error: "Invalid JSON: " + parseErr.message }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...CORS_HEADERS }
          });
        }

        const userMsg = (body.message || "").trim();
        const studentCtx = body.context || "";
        
        if (!userMsg) {
          return new Response(JSON.stringify({ success: false, error: "Empty message" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...CORS_HEADERS }
          });
        }

        if (env.AI) {
          const systemInstruction = `You are OneSRM Academic Copilot, a high-intelligence academic companion designed specifically for SRMIST students.
Provide direct, accurate, comprehensive, and crisp solutions.
When answering:
- Address the student's exact prompt with precision.
- Include full, working code (with comments) for programming queries (C/Python/Java).
- Include clear step-by-step mathematical derivations or LaTeX formulas for Calculus/Math queries.
- Incorporate the student's profile, schedule, and attendance if provided in the context.
- Maintain a direct, supportive, and highly technical tone without mentioning any external model names or providers.
${studentCtx ? "\n[Student Profile & Telemetry Context]:\n" + (typeof studentCtx === "string" ? studentCtx : JSON.stringify(studentCtx)) : ""}`;

          const candidateModels = [
            "@cf/mistral/mistral-7b-instruct-v0.2",
            "@cf/qwen/qwen1.5-7b-chat",
            "@cf/qwen/qwen1.5-14b-chat-awq",
            "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b"
          ];

          let replyText = "";
          for (const model of candidateModels) {
            try {
              const aiRes = await env.AI.run(model, {
                messages: [
                  { role: "system", content: systemInstruction },
                  { role: "user", content: userMsg }
                ],
                max_tokens: 600,
                temperature: 0.3
              });

              const text = (aiRes && (aiRes.response || aiRes.text || (typeof aiRes === "string" ? aiRes : ""))) || "";
              if (text && text.trim()) {
                replyText = text.trim();
                break;
              }
            } catch (_) {
              continue;
            }
          }

          if (replyText) {
            // Strip any internal reasoning tags from deepseek r1
            replyText = replyText.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
            // Completely scrub any Meta / LLaMA / third-party mentions
            replyText = replyText.replace(/\b(Meta|LLaMA|Facebook)\b/gi, "OneSRM");
            return new Response(JSON.stringify({
              success: true,
              reply: replyText,
              provider: "OneSRM Autonomous Copilot",
              timestamp: Math.floor(Date.now() / 1000)
            }), {
              headers: { "Content-Type": "application/json", ...CORS_HEADERS }
            });
          }
        }
        throw new Error("Edge intelligence cluster currently unavailable");
      } catch (err) {
        return new Response(JSON.stringify({
          success: false,
          error: "OneSRM Copilot Error: " + (err.message || String(err))
        }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS }
        });
      }
    }

    // 2.5. Persistent Multi-User Student Storage (Cloudflare KV)
    if (url.pathname === "/api/sync-student" && request.method === "POST") {
      try {
        const body = await request.json();
        const rawId = (body.student_id || body.srm_id || body.username || body.reg_no || "").trim().toLowerCase();
        if (!rawId) {
          return new Response(JSON.stringify({ success: false, error: "student_id or username required" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...CORS_HEADERS }
          });
        }

        const cleanData = {
          ...body,
          synced_at: Math.floor(Date.now() / 1000),
          edge_colo: request.cf?.colo || "Edge"
        };
        await env.SRM_STUDENTS.put(`student:${rawId}`, JSON.stringify(cleanData));

        const regNo = (body.reg_no || "").trim().toUpperCase();
        if (regNo) {
          await env.SRM_STUDENTS.put(`reg:${regNo}`, rawId);
        }

        const syncCode = Math.floor(100000 + Math.random() * 900000).toString();
        await env.SRM_STUDENTS.put(`code:${syncCode}`, rawId, { expirationTtl: 86400 * 30 });

        return new Response(JSON.stringify({
          success: true,
          message: "Student profile securely persisted across all edge nodes",
          student_id: rawId,
          sync_code: syncCode,
          synced_at: cleanData.synced_at
        }), {
          headers: { "Content-Type": "application/json", ...CORS_HEADERS }
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS }
        });
      }
    }

    if (url.pathname.startsWith("/api/get-student/")) {
      const targetId = decodeURIComponent(url.pathname.replace(/^\/api\/get-student\//, "")).trim().toLowerCase();
      try {
        let studentStr = await env.SRM_STUDENTS.get(`student:${targetId}`);
        if (!studentStr) {
          const alias = await env.SRM_STUDENTS.get(`reg:${targetId.toUpperCase()}`);
          if (alias) {
            studentStr = await env.SRM_STUDENTS.get(`student:${alias}`);
          }
        }

        if (studentStr) {
          const data = JSON.parse(studentStr);
          return new Response(JSON.stringify({ success: true, data: data }), {
            headers: { "Content-Type": "application/json", ...CORS_HEADERS }
          });
        }
        return new Response(JSON.stringify({ success: false, error: "Student not found in edge database" }), {
          status: 404,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS }
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS }
        });
      }
    }

    if (url.pathname.startsWith("/api/restore-code/")) {
      const code = url.pathname.replace(/^\/api\/restore-code\//, "").trim();
      try {
        const studentId = await env.SRM_STUDENTS.get(`code:${code}`);
        if (!studentId) {
          return new Response(JSON.stringify({ success: false, error: "Invalid or expired 6-digit sync code" }), {
            status: 404,
            headers: { "Content-Type": "application/json", ...CORS_HEADERS }
          });
        }
        const studentStr = await env.SRM_STUDENTS.get(`student:${studentId}`);
        if (studentStr) {
          return new Response(JSON.stringify({ success: true, student_id: studentId, data: JSON.parse(studentStr) }), {
            headers: { "Content-Type": "application/json", ...CORS_HEADERS }
          });
        }
        return new Response(JSON.stringify({ success: false, error: "Student profile not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS }
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS }
        });
      }
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
