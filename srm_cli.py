#!/usr/bin/env python3
"""
SRM Companion CLI (Command Line Interface)
High-performance terminal client for SRMIST Student Portal ($0-Forever Architecture)

Commands:
  python srm_cli.py login              - Interactive login & save session
  python srm_cli.py attendance         - View attendance table, % and bunk calculator
  python srm_cli.py timetable [day]    - View timetable schedule (Day 1-5 or today)
  python srm_cli.py mess [day]         - View hostel mess menu (M Block / Sannasi)
  python srm_cli.py ai "<prompt>"      - Ask Inception Labs AI Tutor
  python srm_cli.py deploy             - 1-Command instant Vercel cloud deployment
"""

import sys
import os
import json
import time
import getpass
import argparse
from datetime import datetime

# Configure UTF-8 on Windows terminal
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Add root directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from api.index import fetch_srm_captcha, login_and_scrape_portal, AdvancedAIClient

SESSION_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.srm_session.json')

# Terminal Colors
CYAN = '\033[96m'
GREEN = '\033[92m'
YELLOW = '\033[93m'
RED = '\033[91m'
BOLD = '\033[1m'
DIM = '\033[2m'
RESET = '\033[0m'

def print_banner():
    print(f"""{CYAN}{BOLD}
  +=============================================================+
  |                 SRM COMPANION TERMINAL CLI                  |
  |        High-Speed Student Intelligence & Portal Engine      |
  +=============================================================+{RESET}""")

def load_session():
    if os.path.exists(SESSION_FILE):
        try:
            with open(SESSION_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return None
    return None

def save_session(data):
    try:
        with open(SESSION_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        print(f"{GREEN}[OK] Session saved locally to .srm_session.json{RESET}")
    except Exception as e:
        print(f"{RED}[ERR] Failed to save session: {e}{RESET}")

def cmd_login(args):
    print_banner()
    print(f"\n{BOLD}Sign in with your SRMIST NetID{RESET}")
    
    username = input(f"{CYAN}NetID / Username: {RESET}").strip().replace('@srmist.edu.in', '')
    password = getpass.getpass(f"{CYAN}Portal Password: {RESET}")
    
    print(f"\n{YELLOW}[*] Fetching live CAPTCHA from SRM portal...{RESET}")
    cap_data = fetch_srm_captcha()
    
    if not cap_data or not cap_data.get('success'):
        print(f"{RED}[ERR] Failed to reach SRM portal. Check your internet connection.{RESET}")
        return
    
    solved_text = cap_data.get('solved_text', '')
    if solved_text:
        print(f"{GREEN}[OK] AI Neural OCR Solved CAPTCHA: {BOLD}{solved_text}{RESET}")
        captcha = solved_text
    else:
        print(f"{YELLOW}[*] Opening CAPTCHA image preview in browser...{RESET}")
        import webbrowser, tempfile
        img_b64 = cap_data.get('captchaImg', '')
        if img_b64:
            html_content = f"<html><body style='background:#111;display:flex;align-items:center;justify-content:center;height:100vh;'><img src='{img_b64}' style='transform:scale(2);border-radius:8px;border:2px solid #555;' /></body></html>"
            tpath = os.path.join(tempfile.gettempdir(), 'srm_cap.html')
            with open(tpath, 'w', encoding='utf-8') as tf:
                tf.write(html_content)
            webbrowser.open(f'file:///{tpath.replace(os.sep, "/")}')
        
        captcha = input(f"{CYAN}Enter 6-character CAPTCHA code: {RESET}").strip()
    
    print(f"\n{YELLOW}[*] Authenticating & Scraping Academic Portal...{RESET}")
    result = login_and_scrape_portal(
        username=username,
        password=password,
        captcha=captcha,
        cookies_str=cap_data.get('cookies', ''),
        hidden_fields=cap_data.get('hidden_fields', {}),
        sec_config=cap_data.get('sec_config', {})
    )
    
    if result.get('success'):
        print(f"\n{GREEN}{BOLD}[OK] LOGIN SUCCESSFUL!{RESET}")
        p = result.get('personal_info', {})
        print(f"  {BOLD}Name{RESET}     : {p.get('name', 'N/A')}")
        print(f"  {BOLD}Reg No{RESET}   : {p.get('reg_no', 'N/A')}")
        print(f"  {BOLD}Program{RESET}  : {p.get('program', 'N/A')}")
        print(f"  {BOLD}Section{RESET}  : {p.get('section', 'N/A')}")
        save_session(result)
    else:
        print(f"\n{RED}[ERR] Login failed: {result.get('error', 'Invalid credentials or CAPTCHA expired')}{RESET}")

def cmd_attendance(args):
    data = load_session()
    if not data:
        print(f"{RED}[ERR] No active session found. Please run: python srm_cli.py login{RESET}")
        return
    
    print_banner()
    att = data.get('attendance', [])
    if not att:
        print(f"{YELLOW}[!] No attendance records found in session.{RESET}")
        return
    
    print(f"\n{BOLD}{'CODE':<10} {'COURSE NAME':<32} {'COND':<5} {'ATTN':<5} {'ABS':<5} {'%':<7} {'STATUS & BUNK MARGIN':<22}{RESET}")
    print(f"{DIM}{'-'*90}{RESET}")
    
    total_cond = 0
    total_attn = 0
    
    for c in att:
        code = c.get('code', 'N/A')[:9]
        title = c.get('title', 'N/A')[:30]
        cond = int(c.get('conducted') or c.get('hours_conducted') or 0)
        attn = int(c.get('attended') or c.get('hours_attended') or 0)
        absent = int(c.get('absent') or (cond - attn) if cond >= attn else 0)
        pct = float(c.get('pct') or c.get('percentage') or (round(attn*100/cond, 1) if cond > 0 else 0))
        
        total_cond += cond
        total_attn += attn
        
        # Bunk math
        if pct >= 75.0:
            bunk_margin = int((attn - 0.75 * cond) / 0.75) if cond > 0 else 0
            bunk_str = f"{GREEN}[OK] Bunk {bunk_margin} class(es){RESET}" if bunk_margin > 0 else f"{GREEN}[OK] Safe (At 75%){RESET}"
            pct_str = f"{GREEN}{pct:>5.1f}%{RESET}"
        else:
            needed = int((0.75 * cond - attn) / 0.25) + 1 if cond > 0 else 0
            bunk_str = f"{RED}[LOW] Need {needed} class(es){RESET}"
            pct_str = f"{RED}{pct:>5.1f}%{RESET}"
        
        print(f"{CYAN}{code:<10}{RESET} {title:<32} {cond:<5} {attn:<5} {absent:<5} {pct_str}  {bunk_str}")
    
    print(f"{DIM}{'-'*90}{RESET}")
    overall_pct = round(total_attn * 100 / total_cond, 1) if total_cond > 0 else 0
    ov_color = GREEN if overall_pct >= 75 else RED
    print(f"{BOLD}OVERALL AGGREGATE:{RESET} {total_attn}/{total_cond} Hours ({ov_color}{BOLD}{overall_pct}%{RESET})\n")

def cmd_timetable(args):
    data = load_session()
    if not data:
        print(f"{RED}[ERR] No active session found. Please run: python srm_cli.py login{RESET}")
        return
    
    print_banner()
    tt = data.get('timetable', {})
    if not tt:
        print(f"{YELLOW}[!] No timetable schedule found in session.{RESET}")
        return
    
    day_query = args.day.lower() if hasattr(args, 'day') and args.day else ''
    
    print(f"\n{BOLD}ACADEMIC TIMETABLE MATRIX{RESET}\n")
    for day_name, slots in tt.items():
        if day_query and day_query not in day_name.lower():
            continue
        print(f"{CYAN}{BOLD}>> {day_name.upper()}{RESET}")
        print(f"{DIM}{'-'*70}{RESET}")
        if isinstance(slots, list):
            for s in slots:
                if isinstance(s, dict):
                    time_slot = s.get('time') or s.get('hour') or 'Period'
                    sub = s.get('course') or s.get('title') or s.get('code') or 'Free'
                    venue = s.get('venue') or s.get('room') or ''
                    print(f"  {YELLOW}{time_slot:<16}{RESET} {BOLD}{sub:<35}{RESET} {DIM}{venue}{RESET}")
                else:
                    print(f"  {s}")
        elif isinstance(slots, dict):
            for slot_num, detail in slots.items():
                print(f"  {YELLOW}Period {slot_num:<8}{RESET} {BOLD}{str(detail):<35}{RESET}")
        print()

def cmd_mess(args):
    print_banner()
    print(f"\n{BOLD}SRM HOSTEL MESS MENU (Official 01.07.2026 Schedule){RESET}\n")
    today_name = datetime.now().strftime('%A')
    target_day = args.day.capitalize() if hasattr(args, 'day') and args.day else today_name
    print(f"{GREEN}{BOLD}Showing Menu for: {target_day}{RESET}\n")
    
    menu_sample = {
        "Monday": {
            "Breakfast": "Ven Pongal, Tiffin Sambar, Coconut Chutney, Medu Vada, Bread/Omelette, Tea/Coffee",
            "Lunch": "Sweet, White Pumpkin Sambar, Rasam, Beetroot Poriyal, Curd, Steamed Rice, Fryums",
            "Snacks": "Aloo Bonda, Mint Chutney, Tea/Coffee",
            "Dinner": "Phulka, Paneer Butter Masala / Chicken Gravy, Jeera Rice, Dal Tadka, Rasam, Milk"
        },
        "Tuesday": {
            "Breakfast": "Veg Rava Kitchadi, Vegetable Sambar, Poori, Aloo Masala, Boiled Egg, Fruits, Tea/Coffee",
            "Lunch": "Sweet Poori, Variety Rice, Dal Lauki, Tomato Rasam, Curd, Bhindi Fry, Steamed Rice",
            "Snacks": "Boiled Peanut / Sundal, Tea/Coffee",
            "Dinner": "Chapathi, Mix Veg Khurma, Fried Rice / Noodles, Manchurian Dry, Milk, Fruit"
        },
        "Wednesday": {
            "Breakfast": "Idiyappam, Vada Curry / Veg Stew, Poha, Mint Chutney, Bread, Tea/Coffee, Banana",
            "Lunch": "Butter Roti, Aloo Palak, Peas Pulao, Dal Makhni, Steamed Rice, Rasam, Butter Milk",
            "Snacks": "Veg Puff / Sweet Bun, Tea/Coffee",
            "Dinner": "Chapathi, Chicken Masala / Paneer Butter Masala, Dal Tadka, Steamed Rice, Ice Cream"
        },
        "Thursday": {
            "Breakfast": "Idli, Urad Sambar, Groundnut Chutney, Medu Vada, Corn Flakes, Boiled Egg, Tea/Coffee",
            "Lunch": "Luchi, Dam Aloo, Onion Pulao, Moong Dal, Kadi Pakoda, Steamed Rice, Rasam",
            "Snacks": "Parle-G Pori / Chunda Naka, Tea/Coffee",
            "Dinner": "Ghee Pulao, Chapathi, Muttar Paneer, Dal Tadka, Steamed Rice, Rasam, Milk"
        },
        "Friday": {
            "Breakfast": "Kal Dosa, Tiffin Sambar, Tomato Chutney, Semiya Bath, Omelette, Tea/Coffee",
            "Lunch": "Veg Biryani, Mix Raitha, Bisibelebath, Steamed Rice, Tomato Rasam, Aloo Gobi",
            "Snacks": "Bonda / Vada, Chutney, Tea/Coffee",
            "Dinner": "Chole Bhatura, Steamed Rice, Tomato Dal, Samba Rava Upma, Rasam, Milk"
        },
        "Saturday": {
            "Breakfast": "Chapathi, Veg Khurma, Idiyappam, Coconut Chutney, Boiled Egg, Tea/Coffee",
            "Lunch": "Poori, Dal Aloo Masala, Veg Pulao, Steamed Rice, Punjabi Dal, Bhindi Do Pyasa",
            "Snacks": "Brownie / Cake, Tea/Coffee",
            "Dinner": "Malabar Chapathi, Meal Maker Curry, Dal Makhni, Idly, Idly Podi, Fish Gravy"
        },
        "Sunday": {
            "Breakfast": "Onion Poori, Veg Upma, Coconut Chutney, Tea/Coffee, Banana",
            "Lunch": "Chapathi, Kadai Chicken / Paneer Butter Masala, Mint Pulao, Dal, Steamed Rice",
            "Snacks": "Corn / Bajji, Chutney, Tea/Coffee",
            "Dinner": "Paratha, Sambar, Rice, Haleem, Moong Dal, Poriyal, Ice Cream"
        }
    }
    
    day_menu = menu_sample.get(target_day, menu_sample["Monday"])
    for meal, items in day_menu.items():
        print(f"  {YELLOW}{BOLD}{meal:<12}{RESET} : {items}")
    print()

def cmd_ai(args):
    prompt = " ".join(args.prompt) if isinstance(args.prompt, list) else str(args.prompt)
    if not prompt.strip():
        print(f"{RED}[ERR] Please provide a question or topic.{RESET}")
        return
    
    print(f"\n{YELLOW}[*] Inception Labs Mercury AI Engine Querying...{RESET}\n")
    client = AdvancedAIClient()
    
    session = load_session()
    context = ""
    if session:
        p = session.get('personal_info', {})
        context = f"Student: {p.get('name')}, Program: {p.get('program')}, Section: {p.get('section')}."
    
    res = client.query(prompt, system_context=context)
    if res and (res.get('reply') or res.get('response')):
        reply_text = res.get('reply') or res.get('response')
        print(f"{GREEN}{BOLD}AI Tutor Response:{RESET}\n")
        print(reply_text)
        print(f"\n{DIM}(Inference Engine: {res.get('provider', 'Inception Labs Mercury')} | Cost: $0.00){RESET}\n")
    else:
        print(f"{RED}[ERR] AI Query failed: {res.get('error', 'Service unavailable')}{RESET}")

def cmd_deploy(args):
    print_banner()
    print(f"\n{CYAN}{BOLD}1-Command Instant Vercel Cloud Deployment{RESET}\n")
    print("Running Vercel CLI...")
    os.system("npx --yes vercel --prod")

def main():
    parser = argparse.ArgumentParser(description="SRM Companion Command Line Interface")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Login
    subparsers.add_parser("login", help="Sign in to SRM Student Portal")
    
    # Attendance
    subparsers.add_parser("attendance", help="Show attendance matrix & bunk margin")
    
    # Timetable
    tt_parser = subparsers.add_parser("timetable", help="Show class timetable")
    tt_parser.add_argument("day", nargs="?", default="", help="Day 1-5 or Day name")
    
    # Mess
    mess_parser = subparsers.add_parser("mess", help="Show hostel mess menu")
    mess_parser.add_argument("day", nargs="?", default="", help="Day of the week (Monday-Sunday)")
    
    # AI
    ai_parser = subparsers.add_parser("ai", help="Ask AI academic tutor")
    ai_parser.add_argument("prompt", nargs="+", help="Your question or prompt")
    
    # Deploy
    subparsers.add_parser("deploy", help="Deploy backend to Vercel via CLI")
    
    if len(sys.argv) == 1:
        print_banner()
        parser.print_help()
        sys.exit(0)
        
    args = parser.parse_args()
    
    cmd_map = {
        "login": cmd_login,
        "attendance": cmd_attendance,
        "timetable": cmd_timetable,
        "mess": cmd_mess,
        "ai": cmd_ai,
        "deploy": cmd_deploy
    }
    
    if args.command in cmd_map:
        cmd_map[args.command](args)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
