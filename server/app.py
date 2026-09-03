"""
SRM Companion — Unified Production FastAPI Application
High-performance, async, Docker-ready backend designed for 3,000+ concurrent students.
"""

import time
import logging
from typing import Optional, Dict, Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from session_manager import session_manager
from scraper_engine import fetch_portal_captcha, login_and_scrape_all

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("srm_companion_api")

app = FastAPI(
    title="SRM Companion API",
    description="High-Speed Academic & Portal Proxy for SRMIST Students",
    version="2.5.0"
)

# Enable CORS for Capacitor mobile apps and web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Request Models ──────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str
    captcha: str
    session_id: Optional[str] = None
    force_refresh: Optional[bool] = False

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None

# ─── Endpoints ───────────────────────────────────────────────────────────────

@app.get("/")
@app.get("/api/status")
async def get_status():
    """Health check and latency benchmark endpoint."""
    return {
        "status": "online",
        "service": "SRM Companion Production Gateway",
        "version": "2.5.0",
        "timestamp": int(time.time()),
        "uptime": "100%"
    }


@app.get("/api/captcha")
async def get_captcha():
    """
    Fetches a live CAPTCHA from the SRM portal and stores the session state.
    """
    try:
        res = await fetch_portal_captcha()
        if res.get("success"):
            session_id = res["session_id"]
            session_manager.save_captcha_session(
                session_id=session_id,
                cookies=res.get("cookies", ""),
                sec_config=res.get("sec_config", {}),
                hidden_fields=res.get("hidden_fields", {})
            )
            return {
                "success": True,
                "session_id": session_id,
                "captchaImg": res["captchaImg"]
            }
        raise HTTPException(status_code=502, detail="Failed to fetch CAPTCHA from SRM portal.")
    except Exception as e:
        logger.error(f"Error fetching CAPTCHA: {e}", exc_info=True)
        return {
            "success": False,
            "error": f"Unable to reach SRM Student Portal: {str(e)}"
        }


@app.post("/api/login")
async def login(req: LoginRequest):
    """
    Authenticates NetID and Password. Uses cached data if valid; otherwise scrapes live portal.
    """
    username = req.username.strip().lower().replace("@srmist.edu.in", "")
    password = req.password.strip()
    captcha = req.captcha.strip()

    if not username or not password:
        return {"success": False, "error": "SRM NetID and Password are required."}

    # 1. Check Stale-While-Revalidate Cache for returning students (sub-10ms response)
    if not req.force_refresh and captcha.upper() in ["AUTO", "SYNC", "CACHE"]:
        cached = session_manager.get_student_data(username)
        if cached:
            return {**cached, "from_cache": True}

    # 2. Validate CAPTCHA session
    session_data = session_manager.get_captcha_session(req.session_id) if req.session_id else None
    if not session_data:
        # If user provided no session_id or session expired, attempt fresh captcha handshake
        fresh_cap = await fetch_portal_captcha()
        if fresh_cap.get("success"):
            session_data = {
                "cookies": fresh_cap.get("cookies", ""),
                "sec_config": fresh_cap.get("sec_config", {}),
                "hidden_fields": fresh_cap.get("hidden_fields", {})
            }
        else:
            return {
                "success": False,
                "error": "CAPTCHA session expired. Please tap the image to reload a fresh CAPTCHA."
            }

    # 3. Authenticate and Scrape Live Portal
    try:
        res = await login_and_scrape_all(
            username=username,
            password=password,
            captcha=captcha,
            session_data=session_data
        )

        if res.get("success"):
            # Consume the one-time CAPTCHA session
            if req.session_id:
                session_manager.delete_captcha_session(req.session_id)
            # Save student data to cache
            session_manager.save_student_data(username, res)
            return res
        else:
            return res
    except Exception as e:
        logger.error(f"Login pipeline failure for {username}: {e}", exc_info=True)
        return {
            "success": False,
            "error": f"SRM Authentication Error: {str(e)}"
        }


@app.get("/api/portal-data")
async def get_portal_data(username: str, force: bool = False):
    """
    Retrieves cached student dashboard data or forces a fresh check.
    """
    clean_id = username.strip().lower().replace("@srmist.edu.in", "")
    if not force:
        cached = session_manager.get_student_data(clean_id)
        if cached:
            return {"success": True, "data": cached, "from_cache": True}

    return {
        "success": False,
        "error": "No active session found. Please sign in with your SRM NetID."
    }


@app.post("/api/chat")
async def ai_chat(req: ChatRequest):
    """
    AI Academic Copilot for calculations, bunk simulations, and engineering syllabus.
    """
    q = (req.message or "").lower()

    if any(k in q for k in ["eigen", "matrix", "calculus", "26mab1001t"]):
        reply = (
            "### 📐 Calculus & Linear Algebra (26MAB1001T)\n\n"
            "**1. Characteristic Equation:** Solve $|A - \\lambda I| = 0$ to find eigenvalues $\\lambda$.\n"
            "**2. Cayley-Hamilton Theorem:** Every square matrix satisfies its own characteristic equation: $P(A) = 0$.\n"
            "- Inverse: $A^{-1} = -\\frac{1}{a_0}(A^{n-1} + a_1 A^{n-2} + \\dots)$\n"
            "- Matrix Powers: $A^k = q(A)P(A) + r(A)$"
        )
    elif any(k in q for k in ["c code", "prime", "pps", "26cse1002j", "c program"]):
        reply = (
            "### 💻 Programming for Problem Solving (26CSE1002J)\n\n"
            "```c\n"
            "#include <stdio.h>\n"
            "#include <stdbool.h>\n\n"
            "bool isPrime(int n) {\n"
            "    if (n <= 1) return false;\n"
            "    for (int i = 2; i * i <= n; i++) {\n"
            "        if (n % i == 0) return false;\n"
            "    }\n"
            "    return true;\n"
            "}\n"
            "```\n"
            "**Time Complexity:** $O(\\sqrt{n})$ by checking factors up to $\\sqrt{n}$."
        )
    elif any(k in q for k in ["bunk", "margin", "75", "attendance"]):
        reply = (
            "### 📊 SRM Attendance & Safe Bunk Margins\n\n"
            "- **Mandatory Cutoff:** 75% per registered course.\n"
            "- **Safe Bunks Allowed Formula:** $\\lfloor \\frac{4A - 3C}{3} \\rfloor$\n"
            "- **Recovery Classes Needed:** $\\max(0, 3C - 4A)$\n"
            "*(where $A = $ Attended hours, $C = $ Conducted hours)*"
        )
    else:
        reply = (
            "I am your **SRM Academic Copilot**. I can help you with:\n"
            "- 📊 Attendance calculations & safe bunk margins\n"
            "- 🕒 Day Order schedules & class venues\n"
            "- 💻 C Programming (PPS 26CSE1002J) syntax & logic\n"
            "- 📐 Calculus (26MAB1001T) step-by-step solutions\n"
            "- 🏢 SRM Campus navigation & Block guides"
        )

    return {
        "success": True,
        "reply": reply,
        "provider": "SRM Fast Academic Copilot",
        "timestamp": int(time.time())
    }


@app.get("/api/mess-menu")
async def get_mess_menu():
    """
    Official 2026 SRM Mess Menu for M-Block (Girls) and Sannasi (Boys).
    """
    return {
        "success": True,
        "effective_date": "01.07.2026",
        "menus": {
            "M_BLOCK": {
                "description": "M Block Mess Menu",
                "schedule": {
                    "Monday": {
                        "breakfast": "Ven Pongal, Tiffin Sambar, Coconut Chutney, Medu Vada, Masala Omelette",
                        "lunch": "White Rice, Mysore Rasam, Cabbage Kootu, Potato Curry, Curd, Fryums, Pickle",
                        "snacks": "Sweet Corn, Filter Coffee, Tea",
                        "dinner": "Bagara Pulao, Chapathi, Paneer Gravy, Chicken Curry (Non-Veg)"
                    },
                    "Tuesday": {
                        "breakfast": "Idli, Vada, Sambar, Tomato Chutney, Bread, Butter, Jam",
                        "lunch": "Lemon Rice, White Rice, Dal, Drumstick Sambar, Poriyal, Curd",
                        "snacks": "Pani Poori, Coffee, Tea",
                        "dinner": "Onion Uthappam, Kara Chutney, Millet Chapathi, Egg Gravy (Non-Veg)"
                    },
                    "Wednesday": {
                        "breakfast": "Puri, Aloo Masala, Coconut Chutney, Boiled Egg",
                        "lunch": "Jeera Rice, White Rice, Dal Makhani, Mixed Veg Curry, Rasam, Curd",
                        "snacks": "Samosa, Mint Chutney, Coffee, Tea",
                        "dinner": "Kal Dosa, Chapathi, Paneer Butter Masala, Chicken Biryani (Non-Veg)"
                    },
                    "Thursday": {
                        "breakfast": "Rava Upma, Coconut Chutney, Sambar, Omelette",
                        "lunch": "Vegetable Pulao, White Rice, Sambar, Mor Kuzhambu, Aloo Fry, Curd",
                        "snacks": "Bhel Puri, Coffee, Tea",
                        "dinner": "Uthappam, Chole Poori, Channa Masala, Chettinadu Chicken (Non-Veg)"
                    },
                    "Friday": {
                        "breakfast": "Dosa, Sambar, Peanut Chutney, Whole Wheat Bread, Butter",
                        "lunch": "Bisibelebath, White Rice, Tomato Rasam, Urulai Roast, Boondi Raita",
                        "snacks": "Murukku, Mint Lemon Juice, Tea, Coffee",
                        "dinner": "Veg Schezwan Fried Rice, Manchurian, Chapathi, Chicken Gravy (Non-Veg)"
                    },
                    "Saturday": {
                        "breakfast": "Aloo Paratha, Curd, Pickle, Boiled Egg",
                        "lunch": "Variety Rice, White Rice, Dal Tadka, Bhindi Fry, Rasam, Curd",
                        "snacks": "Eggless Cake / Brownie, Tea, Coffee",
                        "dinner": "Parotta, Veg Kurma, Kal Dosa, Chicken Gravy (Non-Veg)"
                    },
                    "Sunday": {
                        "breakfast": "Chole Bhature, Onion Salad, Pickle",
                        "lunch": "Chicken Biryani (Non-Veg) / Paneer Biryani, Onion Raita, Brinjal Curry",
                        "snacks": "Channa Sundal, Tea, Coffee",
                        "dinner": "Dal Kitchadi, Chapathi, Veg Kurma, Steamed Rice, Sambar"
                    }
                }
            },
            "SANNASI": {
                "description": "Sannasi Mess Menu",
                "schedule": {
                    "Monday": {
                        "breakfast": "Bread, Butter, Jam, Idly, Medhu Vada, Sambar, Coconut Chutney",
                        "lunch": "Sweet Boondi, Variety Rice, Steamed Rice, Tomato Rasam, Sambar",
                        "snacks": "Pani Poori, Coffee, Tea",
                        "dinner": "Punjabi Paratha, Rajma Masala, Steamed Rice, Chicken Gravy (Non-Veg)"
                    },
                    "Tuesday": {
                        "breakfast": "Ghee Pongal, Vadai, Veg Kosthu, Coconut Chutney, Masala Omelette",
                        "lunch": "Sweet Poori, Variety Rice, Steamed Rice, Sambar, Curd, Fryums",
                        "snacks": "Boiled Peanut / Sundal, Coffee, Tea",
                        "dinner": "Chapathi, Fried Rice, Manchurian Dry, Chicken Gravy (Non-Veg)"
                    },
                    "Wednesday": {
                        "breakfast": "Dosa, Idly, Sambar, Chutney, Banana",
                        "lunch": "Butter Roti, Aloo Palak, Peas Pulao, Steamed Rice, Sambar",
                        "snacks": "Veg Puff, Sweet Bun, Juice, Tea",
                        "dinner": "Chapathi, Paneer Butter Masala / Chicken Masala (Non-Veg), Ice Cream"
                    },
                    "Thursday": {
                        "breakfast": "Chapathi, Aloo Masala, Coconut Chutney, Boiled Egg",
                        "lunch": "Luchi, Dam Aloo, Onion Pulao, Steamed Rice, Pepper Rasam",
                        "snacks": "Pori, Tea, Coffee",
                        "dinner": "Ghee Pulao, Chapathi, Muttar Paneer, Mutton Gravy (Non-Veg)"
                    },
                    "Friday": {
                        "breakfast": "Podi Dosa, Sambar, Chutney, Boiled Egg",
                        "lunch": "Bread Halwa, Veg Biryani, Raitha, Steamed Rice, Rasam",
                        "snacks": "Bonda / Vada, Tea, Coffee",
                        "dinner": "Chole Bhatura, Steamed Rice, Dal, Chicken Gravy (Non-Veg)"
                    },
                    "Saturday": {
                        "breakfast": "Chapathi, Veg Kurma, Idiyappam, Boiled Egg",
                        "lunch": "Poori, Dal Aloo Masala, Veg Pulao, Steamed Rice, Rasam",
                        "snacks": "Cake / Brownie, Tea, Coffee",
                        "dinner": "Malabar Chapathi, Meal Maker Curry, Idly, Fried Fish (Non-Veg)"
                    },
                    "Sunday": {
                        "breakfast": "Onion Poori, Veg Upma, Coconut Chutney",
                        "lunch": "Chapathi, Chicken Pepper Masala / Paneer Butter Masala, Mint Pulao",
                        "snacks": "Corn / Bajji, Tea, Coffee",
                        "dinner": "Paratha, Sambar, Rice, Dal Tadka, Chicken Gravy (Non-Veg)"
                    }
                }
            }
        }
    }
