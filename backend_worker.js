/**
 * SRM Companion - Serverless AI Edge Backend (Cloudflare Worker / Node.js)
 * 100,000 Free Requests/Day • Zero Cold Start • Never Sleeps
 */

// In-Memory / Edge KV Store for Active Tasks
let activeTasks = [
    {
        id: "task-1",
        subject: "Workshop Practice",
        code: "26MEE1001L",
        task: "Bring printed Sheet Metal manual from Tech Park/Java Xerox",
        deadline: "Day 3 (Workshop)",
        priority: "HIGH",
        sourceGroup: "Batch 1 Official",
        timestamp: new Date().toISOString()
    }
];

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { headers });
        }

        // Endpoint 1: Get all parsed tasks for the Companion App
        if (url.pathname === "/api/tasks" && request.method === "GET") {
            return new Response(JSON.stringify({ success: true, tasks: activeTasks }), { headers });
        }

        // Endpoint 2: Direct Ingestion & AI Task Extractor (From WhatsApp Webhook or App Paste)
        if (url.pathname === "/api/ingest" && request.method === "POST") {
            try {
                const body = await request.json();
                const rawText = body.text || body.message || "";
                const groupName = body.groupName || "SRM Group";

                if (!rawText.trim()) {
                    return new Response(JSON.stringify({ error: "Empty message" }), { status: 400, headers });
                }

                // AI Prompt to extract structured tasks
                const aiPrompt = `
You are an academic parser for 1st-year SRM student Karanam Sai Prasanth studying:
- 26CSE1002J: Programming for Problem Solving (PPS)
- 26MAB1001T: Calculus and Linear Algebra
- 26CYB1002J: Chemistry for Computer Science
- 26BTB1001T: Computational Biology
- 26MEE1001L: Workshop Practice

Extract any homework, xerox instruction, manual requirement, test announcement, or deadline from this message:
"${rawText}"

Output STRICT JSON only with this structure:
{
  "isRelevant": true/false,
  "subject": "Subject Name",
  "code": "Course Code or null",
  "task": "One-line clear instruction (e.g. Bring Sheet Metal manual from Java Xerox)",
  "deadline": "Day Order or Date or null",
  "priority": "HIGH / MEDIUM / LOW"
}
`;

                // Query Keyless AI Engine
                const aiResp = await fetch("https://text.pollinations.ai/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        messages: [
                            { role: "system", content: "You are a JSON-only response engine." },
                            { role: "user", content: aiPrompt }
                        ]
                    })
                });

                const aiRaw = await aiResp.text();
                
                // Parse JSON from AI response
                const jsonMatch = aiRaw.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsedTask = JSON.parse(jsonMatch[0]);
                    if (parsedTask.isRelevant) {
                        const newTask = {
                            id: "task-" + Date.now(),
                            subject: parsedTask.subject || "General Academic",
                            code: parsedTask.code || "GENERAL",
                            task: parsedTask.task,
                            deadline: parsedTask.deadline || "Next Class",
                            priority: parsedTask.priority || "MEDIUM",
                            sourceGroup: groupName,
                            timestamp: new Date().toISOString()
                        };
                        activeTasks.unshift(newTask);
                        // Keep last 30 tasks
                        if (activeTasks.length > 30) activeTasks.pop();

                        return new Response(JSON.stringify({ success: true, task: newTask }), { headers });
                    }
                }

                return new Response(JSON.stringify({ success: false, message: "No actionable task found in message" }), { headers });

            } catch (err) {
                return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
            }
        }

        return new Response(JSON.stringify({ message: "SRM Companion AI Edge API Live" }), { headers });
    }
};
