"""
SRM Student Companion - Automated WhatsApp Daily Alert Dispatcher
Student: Karanam Sai Prasanth (RA2611026010283)

Features:
1. Daily morning briefing at scheduled time (e.g. 07:30 AM).
2. Sends exact Day Order, list of classes, rooms, and faculty directly to your WhatsApp.
3. Uses free Webhook API (CallMeBot / Twilio / URL launcher) with ZERO paid API keys.
"""

import os
import json
import datetime
import urllib.parse
import urllib.request
import webbrowser

def get_today_agenda():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, '..', 'calendar_data.json')
    if not os.path.exists(data_path):
        data_path = r'C:\Users\Praashu\.gemini\antigravity\scratch\calendar_data.json'

    with open(data_path, 'r', encoding='utf-8') as f:
        calendar = json.load(f)

    # Format today's date DD-MM-YYYY
    today_dt = datetime.datetime.now()
    today_str = today_dt.strftime('%d-%m-%Y')

    cal_entry = next((c for c in calendar if c['date'] == today_str), None)

    if not cal_entry:
        return f"📅 *SRM Daily Alert - {today_str}*\nNo entry found for today in academic calendar."

    if cal_entry['status'] == 'Holiday':
        holiday_name = cal_entry['remarks'] if cal_entry['remarks'] != '-' else cal_entry['day']
        return (
            f"🌴 *SRM Holiday Alert - {today_str} ({cal_entry['day']})*\n"
            f"━━━━━━━━━━━━━━━━━━━━━\n"
            f"🎉 *No Classes Today!*\n"
            f"Reason: {holiday_name}\n"
            f"Enjoy your break, Prasanth!"
        )

    # Day Order Schedules
    schedules = {
        'Day 1': [
            ("08:00 - 08:50", "Computational Biology", "UB 601", "A", "Sivasankareswari E"),
            ("08:50 - 09:40", "Computational Biology", "UB 601", "A", "Sivasankareswari E"),
            ("01:25 - 03:10", "Chemistry Lab", "Chem Lab Block 1st Fl, Lab 4", "P7, P8", "Dr. John Bosco A")
        ],
        'Day 2': [
            ("09:45 - 11:30", "Programming Lab (PPS)", "Tech Park 3rd Fl, Integrative Lab", "P13, P14", "Sheeba Rachel S"),
            ("12:30 - 02:15", "Calculus & Linear Algebra", "UB 601", "B", "Dr. N. Parvathi"),
            ("04:00 - 04:50", "Computational Biology", "UB 601", "A", "Sivasankareswari E")
        ],
        'Day 3': [
            ("09:45 - 10:35", "Computational Biology", "UB 601", "A", "Sivasankareswari E"),
            ("10:40 - 11:30", "Chemistry Theory", "UB 601", "D", "Dr. John Bosco A"),
            ("11:35 - 12:25", "Calculus & Linear Algebra", "UB 601", "B", "Dr. N. Parvathi"),
            ("01:25 - 04:50", "Workshop Practice", "BEL Ground Floor, Sheet Metal Lab", "P27-P30", "Dr. Manoj Samson R")
        ],
        'Day 4': [
            ("12:30 - 02:15", "Chemistry Theory", "UB 601", "D", "Dr. John Bosco A"),
            ("02:20 - 03:10", "Calculus & Linear Algebra", "UB 601", "B", "Dr. N. Parvathi"),
            ("03:10 - 04:00", "Programming Theory (PPS)", "UB 601", "E", "Sheeba Rachel S")
        ],
        'Day 5': [
            ("08:00 - 09:40", "Programming Theory (PPS)", "UB 601", "E", "Sheeba Rachel S"),
            ("11:35 - 12:25", "Chemistry Theory", "UB 601", "D", "Dr. John Bosco A")
        ]
    }

    day_order = cal_entry['day_order']
    classes = schedules.get(day_order, [])

    msg_lines = [
        f"🔔 *SRM Good Morning Briefing*",
        f"👤 *Karanam Sai Prasanth* (RA2611026010283)",
        f"📅 Date: {today_str} ({cal_entry['day']})",
        f"🎯 *Day Order: {day_order}* ({cal_entry['week']})",
        f"━━━━━━━━━━━━━━━━━━━━━\n"
    ]

    for time_lbl, title, venue, slot, faculty in classes:
        msg_lines.append(f"⏰ *{time_lbl}*\n📚 {title}\n📍 {venue} | Slot: {slot}\n👤 {faculty}\n")

    msg_lines.append("━━━━━━━━━━━━━━━━━━━━━")
    msg_lines.append("💡 _Have a productive day at SRM!_")

    return "\n".join(msg_lines)

def send_via_callmebot(phone_number, apikey, message):
    """
    Sends WhatsApp message via free CallMeBot Gateway (Zero paid API keys).
    Setup: Send 'I allow callmebot to send me messages' to +34 644 59 71 67 on WhatsApp to get free key.
    """
    encoded_msg = urllib.parse.quote(message)
    url = f"https://api.callmebot.com/whatsapp.php?phone={phone_number}&text={encoded_msg}&apikey={apikey}"
    try:
        req = urllib.request.urlopen(url)
        print("Alert successfully sent to WhatsApp via CallMeBot!")
    except Exception as e:
        print(f"Error dispatching via CallMeBot: {e}")

def open_whatsapp_web(message):
    """Opens WhatsApp Web / Desktop app pre-filled with today's message."""
    encoded_msg = urllib.parse.quote(message)
    url = f"https://api.whatsapp.com/send?text={encoded_msg}"
    print(f"Opening WhatsApp with daily schedule...")
    webbrowser.open(url)

if __name__ == '__main__':
    agenda = get_today_agenda()
    print("\n--- TODAY'S FORMATTED WHATSAPP ALERT ---\n")
    print(agenda)
    print("\n----------------------------------------\n")
    print("Options:")
    print("1. Open in WhatsApp Web / App directly")
    print("2. Test CallMeBot automated dispatch")
    
    # By default, open web launcher
    open_whatsapp_web(agenda)
