"""
SRM Semester Timetable .ics Calendar Generator
Student: Karanam Sai Prasanth (RA2611026010283)
"""

import json
import os

def generate_ics():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    calendar_json_path = os.path.join(base_dir, '..', 'calendar_data.json')
    
    # Fallback to local if not found in parent
    if not os.path.exists(calendar_json_path):
        calendar_json_path = r'C:\Users\Praashu\.gemini\antigravity\scratch\calendar_data.json'
        
    with open(calendar_json_path, 'r', encoding='utf-8') as f:
        calendar_data = json.load(f)

    # Time slots definition
    time_slots = [
        {'hour': 1, 'start': '08:00', 'end': '08:50'},
        {'hour': 2, 'start': '08:50', 'end': '09:40'},
        {'hour': 3, 'start': '09:45', 'end': '10:35'},
        {'hour': 4, 'start': '10:40', 'end': '11:30'},
        {'hour': 5, 'start': '11:35', 'end': '12:25'},
        {'hour': 6, 'start': '12:30', 'end': '13:20'},
        {'hour': 7, 'start': '13:25', 'end': '14:15'},
        {'hour': 8, 'start': '14:20', 'end': '15:10'},
        {'hour': 9, 'start': '15:10', 'end': '16:00'},
        {'hour': 10, 'start': '16:00', 'end': '16:50'},
        {'hour': 11, 'start': '16:50', 'end': '17:30'},
        {'hour': 12, 'start': '17:30', 'end': '18:10'}
    ]

    day_order_schedule = {
        'Day 1': [
            {'hour': 1, 'title': 'Computational Biology (26BTB1001T)', 'type': 'Theory', 'venue': 'UB 601 (Annexure-II)', 'slot': 'A', 'faculty': 'Sivasankareswari E'},
            {'hour': 2, 'title': 'Computational Biology (26BTB1001T)', 'type': 'Theory', 'venue': 'UB 601 (Annexure-II)', 'slot': 'A', 'faculty': 'Sivasankareswari E'},
            {'hour': 7, 'title': 'Chemistry Lab (26CYB1002J)', 'type': 'Lab', 'venue': 'Chem Lab Block, 1st Fl, Lab 4', 'slot': 'P7', 'faculty': 'Dr. John Bosco A'},
            {'hour': 8, 'title': 'Chemistry Lab (26CYB1002J)', 'type': 'Lab', 'venue': 'Chem Lab Block, 1st Fl, Lab 4', 'slot': 'P8', 'faculty': 'Dr. John Bosco A'}
        ],
        'Day 2': [
            {'hour': 3, 'title': 'Programming Lab (26CSE1002J)', 'type': 'Lab', 'venue': 'Tech Park 3rd Fl, Integrative Lab', 'slot': 'P13', 'faculty': 'Sheeba Rachel S'},
            {'hour': 4, 'title': 'Programming Lab (26CSE1002J)', 'type': 'Lab', 'venue': 'Tech Park 3rd Fl, Integrative Lab', 'slot': 'P14', 'faculty': 'Sheeba Rachel S'},
            {'hour': 6, 'title': 'Calculus & Linear Algebra (26MAB1001T)', 'type': 'Theory', 'venue': 'UB 601 (Annexure-II)', 'slot': 'B', 'faculty': 'Dr. N. Parvathi'},
            {'hour': 7, 'title': 'Calculus & Linear Algebra (26MAB1001T)', 'type': 'Theory', 'venue': 'UB 601 (Annexure-II)', 'slot': 'B', 'faculty': 'Dr. N. Parvathi'},
            {'hour': 10, 'title': 'Computational Biology (26BTB1001T)', 'type': 'Theory', 'venue': 'UB 601 (Annexure-II)', 'slot': 'A', 'faculty': 'Sivasankareswari E'}
        ],
        'Day 3': [
            {'hour': 3, 'title': 'Computational Biology (26BTB1001T)', 'type': 'Theory', 'venue': 'UB 601 (Annexure-II)', 'slot': 'A', 'faculty': 'Sivasankareswari E'},
            {'hour': 4, 'title': 'Chemistry Theory (26CYB1002J)', 'type': 'Theory', 'venue': 'UB 601 (Annexure-II)', 'slot': 'D', 'faculty': 'Dr. John Bosco A'},
            {'hour': 5, 'title': 'Calculus & Linear Algebra (26MAB1001T)', 'type': 'Theory', 'venue': 'UB 601 (Annexure-II)', 'slot': 'B', 'faculty': 'Dr. N. Parvathi'},
            {'hour': 7, 'title': 'Workshop Practice (26MEE1001L)', 'type': 'Lab', 'venue': 'BEL Ground Floor, Sheet Metal Lab', 'slot': 'P27', 'faculty': 'Dr. Manoj Samson R'},
            {'hour': 8, 'title': 'Workshop Practice (26MEE1001L)', 'type': 'Lab', 'venue': 'BEL Ground Floor, Sheet Metal Lab', 'slot': 'P28', 'faculty': 'Dr. Manoj Samson R'},
            {'hour': 9, 'title': 'Workshop Practice (26MEE1001L)', 'type': 'Lab', 'venue': 'BEL Ground Floor, Sheet Metal Lab', 'slot': 'P29', 'faculty': 'Dr. Manoj Samson R'},
            {'hour': 10, 'title': 'Workshop Practice (26MEE1001L)', 'type': 'Lab', 'venue': 'BEL Ground Floor, Sheet Metal Lab', 'slot': 'P30', 'faculty': 'Dr. Manoj Samson R'}
        ],
        'Day 4': [
            {'hour': 6, 'title': 'Chemistry Theory (26CYB1002J)', 'type': 'Theory', 'venue': 'UB 601 (Annexure-II)', 'slot': 'D', 'faculty': 'Dr. John Bosco A'},
            {'hour': 7, 'title': 'Chemistry Theory (26CYB1002J)', 'type': 'Theory', 'venue': 'UB 601 (Annexure-II)', 'slot': 'D', 'faculty': 'Dr. John Bosco A'},
            {'hour': 8, 'title': 'Calculus & Linear Algebra (26MAB1001T)', 'type': 'Theory', 'venue': 'UB 601 (Annexure-II)', 'slot': 'B', 'faculty': 'Dr. N. Parvathi'},
            {'hour': 9, 'title': 'Programming Theory (26CSE1002J)', 'type': 'Theory', 'venue': 'UB 601 (Annexure-II)', 'slot': 'E', 'faculty': 'Sheeba Rachel S'}
        ],
        'Day 5': [
            {'hour': 1, 'title': 'Programming Theory (26CSE1002J)', 'type': 'Theory', 'venue': 'UB 601 (Annexure-II)', 'slot': 'E', 'faculty': 'Sheeba Rachel S'},
            {'hour': 2, 'title': 'Programming Theory (26CSE1002J)', 'type': 'Theory', 'venue': 'UB 601 (Annexure-II)', 'slot': 'E', 'faculty': 'Sheeba Rachel S'},
            {'hour': 5, 'title': 'Chemistry Theory (26CYB1002J)', 'type': 'Theory', 'venue': 'UB 601 (Annexure-II)', 'slot': 'D', 'faculty': 'Dr. John Bosco A'}
        ]
    }

    ics_lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//SRM Student Companion//Schedule Sync//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:SRM Timetable (Karanam Sai Prasanth)',
        'X-WR-TIMEZONE:Asia/Kolkata'
    ]

    event_count = 0
    for entry in calendar_data:
        if entry['status'] != 'Holiday' and entry['day_order'] in day_order_schedule:
            dd, mm, yyyy = entry['date'].split('-')
            classes = day_order_schedule[entry['day_order']]

            for c in classes:
                slot = time_slots[c['hour'] - 1]
                sH, sM = slot['start'].split(':')
                eH, eM = slot['end'].split(':')

                dt_start = f"{yyyy}{mm}{dd}T{sH.zfill(2)}{sM.zfill(2)}00"
                dt_end = f"{yyyy}{mm}{dd}T{eH.zfill(2)}{eM.zfill(2)}00"

                ics_lines.append('BEGIN:VEVENT')
                ics_lines.append(f'SUMMARY:{c["title"]}')
                ics_lines.append(f'LOCATION:{c["venue"]}')
                ics_lines.append(f'DESCRIPTION:Faculty: {c["faculty"]}\\nSlot: {c["slot"]}\\nDay Order: {entry["day_order"]}\\nStudent: Karanam Sai Prasanth')
                ics_lines.append(f'DTSTART;TZID=Asia/Kolkata:{dt_start}')
                ics_lines.append(f'DTEND;TZID=Asia/Kolkata:{dt_end}')
                ics_lines.append(f'UID:{dt_start}-{c["hour"]}@srmcompanion.local')
                ics_lines.append('STATUS:CONFIRMED')
                ics_lines.append('END:VEVENT')
                event_count += 1

    ics_lines.append('END:VCALENDAR')

    out_file = os.path.join(base_dir, 'SRM_Semester_Timetable.ics')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write('\r\n'.join(ics_lines))

    print(f"Successfully generated {out_file} with {event_count} class events!")
    return out_file

if __name__ == '__main__':
    generate_ics()
