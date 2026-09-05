// SRM Student Companion - Offline-First Persistent Data Store
// Automatically verified against SRMIST Student Portal

var APP_BUILD_VERSION = "2.5.6";
var APP_BUILD_TIMESTAMP = "2026-09-05T19:00:00";
if (typeof window !== 'undefined') {
    window.APP_BUILD_VERSION = APP_BUILD_VERSION;
    window.APP_BUILD_TIMESTAMP = APP_BUILD_TIMESTAMP;
}

var SRM_DATA = {
    profile: {
        "name": (typeof localStorage !== 'undefined' && localStorage.getItem('srm_display_name')) || "SRM Student",
        "studentId": (typeof localStorage !== 'undefined' && localStorage.getItem('srm_auto_id')) || "",
        "regNo": (typeof localStorage !== 'undefined' && localStorage.getItem('srm_reg_no')) || "",
        "email": (typeof localStorage !== 'undefined' && localStorage.getItem('srm_email')) || "",
        "personalEmail": "",
        "mobile": "",
        "altMobile": "",
        "institution": (typeof localStorage !== 'undefined' && localStorage.getItem('srm_institution')) || "SRM Institute of Science and Technology",
        "campus": "Kattankulathur Campus",
        "program": (typeof localStorage !== 'undefined' && localStorage.getItem('srm_program')) || "Undergraduate Program",
        "batch": (typeof localStorage !== 'undefined' && localStorage.getItem('srm_batch')) || "",
        "semester": (typeof localStorage !== 'undefined' && localStorage.getItem('srm_semester')) || "",
        "section": (typeof localStorage !== 'undefined' && localStorage.getItem('srm_section')) || "",
        "abcId": "",
        "dob": "",
        "gender": "",
        "bloodGroup": "",
        "nationality": "Indian",
        "facultyAdvisor": (typeof localStorage !== 'undefined' && localStorage.getItem('srm_advisor')) || "",
        "academicAdvisor": "",
        "orientationRoom": "",
        "enrollmentDate": "",
        "parents": {
            "fatherName": "",
            "motherName": "",
            "contactNo": "",
            "email": ""
        },
        "address": {
            "line": "",
            "district": "",
            "state": "",
            "pincode": ""
        },
        "hostel": (typeof localStorage !== 'undefined' && localStorage.getItem('srm_user_hostel_block')) || "",
        "room": (typeof localStorage !== 'undefined' && localStorage.getItem('srm_user_room_no')) || "",
        "residence": "",
        "hostelAllocatedDate": "",
        "academicYear": "2026-2027",
        "examResultsStatus": "active_semester",
        "officialCGPA": null,
        "feeDetails": {
            "tuition": "Paid (Cleared)",
            "hostel": "Paid (₹2,30,500)",
            "bus": "N/A",
            "balanceDues": "₹0"
        }
    },
    courses: [
        {
                "code": "26CSE1002J",
                "title": "PROGRAMMING FOR PROBLEM SOLVING",
                "credits": 3,
                "theorySlot": "P31, P32",
                "labSlot": "P31, P32",
                "theoryFaculty": "DR. ARUN PRASATH S",
                "labFaculty": "DR. ARUN PRASATH S",
                "theoryLocation": "7th Floor - UB712 Blockchain Laboratory",
                "labLocation": "7th Floor - UB712 Blockchain Laboratory",
                "category": "Core Professional Engineering"
        },
        {
                "code": "26MAB1001T",
                "title": "CALCULUS AND LINEAR ALGEBRA",
                "credits": 4,
                "theorySlot": "D",
                "labSlot": null,
                "theoryFaculty": "DR. N. PARVATHI",
                "labFaculty": null,
                "theoryLocation": "UB 9th Floor, Room 901",
                "labLocation": null,
                "category": "Basic Sciences"
        },
        {
                "code": "26CYB1002J",
                "title": "CHEMISTRY FOR COMPUTER SCIENCE",
                "credits": 4,
                "theorySlot": "P29, P30",
                "labSlot": "P29, P30",
                "theoryFaculty": "DR. MIHIR GHOSH",
                "labFaculty": "DR. MIHIR GHOSH",
                "theoryLocation": "Ground Floor - CL-1C Chemistry Laboratory 3",
                "labLocation": "Ground Floor - CL-1C Chemistry Laboratory 3",
                "category": "Basic Sciences"
        },
        {
                "code": "26BTB1001T",
                "title": "INTRODUCTION TO COMPUTATIONAL BIOLOGY",
                "credits": 2,
                "theorySlot": "G",
                "labSlot": null,
                "theoryFaculty": "SAILESHWAR M",
                "labFaculty": null,
                "theoryLocation": "UB 9th Floor, Room 901",
                "labLocation": null,
                "category": "Basic Sciences"
        },
        {
                "code": "26MEE1001L",
                "title": "WORKSHOP PRACTICE",
                "credits": 2,
                "theorySlot": null,
                "labSlot": "P47, P48, P49, P50",
                "theoryFaculty": null,
                "labFaculty": "DR. ANUSUYA K",
                "theoryLocation": null,
                "labLocation": "Ground Floor - BEL101 Sheet Metal Lab",
                "category": "Engineering Sciences / Practical"
        },
        {
                "code": "26LCA1006J",
                "title": "KOREAN",
                "credits": 2,
                "theorySlot": "X",
                "labSlot": null,
                "theoryFaculty": "JASMINE ANKITA BAGE",
                "labFaculty": null,
                "theoryLocation": "Main Campus",
                "labLocation": null,
                "category": "Foreign Language Elective"
        },
        {
                "code": "26GNN1007J",
                "title": "PHYSICAL AND MENTAL HEALTH USING YOGA",
                "credits": 1,
                "theorySlot": "P7, P8, P9",
                "labSlot": null,
                "theoryFaculty": "DR. DHANALAKSHMI K",
                "labFaculty": null,
                "theoryLocation": "6th Floor - 601 AVVAI HALL",
                "labLocation": null,
                "category": "Mandatory Non-Credit / Health Course"
        }
],
    timeSlots: [
    {
        "hour": 1,
        "start": "08:00",
        "end": "08:50",
        "label": "08:00 - 08:50"
    },
    {
        "hour": 2,
        "start": "08:50",
        "end": "09:40",
        "label": "08:50 - 09:40"
    },
    {
        "hour": 3,
        "start": "09:45",
        "end": "10:35",
        "label": "09:45 - 10:35"
    },
    {
        "hour": 4,
        "start": "10:40",
        "end": "11:30",
        "label": "10:40 - 11:30"
    },
    {
        "hour": 5,
        "start": "11:35",
        "end": "12:25",
        "label": "11:35 - 12:25"
    },
    {
        "hour": 6,
        "start": "12:30",
        "end": "13:20",
        "label": "12:30 - 01:20"
    },
    {
        "hour": 7,
        "start": "13:25",
        "end": "14:15",
        "label": "01:25 - 02:15"
    },
    {
        "hour": 8,
        "start": "14:20",
        "end": "15:10",
        "label": "02:20 - 03:10"
    },
    {
        "hour": 9,
        "start": "15:10",
        "end": "16:00",
        "label": "03:10 - 04:00"
    },
    {
        "hour": 10,
        "start": "16:00",
        "end": "16:50",
        "label": "04:00 - 04:50"
    },
    {
        "hour": 11,
        "start": "16:50",
        "end": "17:30",
        "label": "04:50 - 05:30"
    },
    {
        "hour": 12,
        "start": "17:30",
        "end": "18:10",
        "label": "05:30 - 06:10"
    }
],
    dayOrderSchedule: {
    "Day 1": [
        {
            "hour": 1,
            "code": "26BTB1001T",
            "title": "Computational Biology",
            "type": "Theory",
            "venue": "UB 601",
            "slot": "A",
            "faculty": "Sivasankareswari E"
        },
        {
            "hour": 2,
            "code": "26BTB1001T",
            "title": "Computational Biology",
            "type": "Theory",
            "venue": "UB 601",
            "slot": "A",
            "faculty": "Sivasankareswari E"
        },
        {
            "hour": 3,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "F",
            "faculty": "-"
        },
        {
            "hour": 4,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "F",
            "faculty": "-"
        },
        {
            "hour": 5,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "G",
            "faculty": "-"
        },
        {
            "hour": 6,
            "code": null,
            "title": "Lunch / Free",
            "type": "Free",
            "venue": "-",
            "slot": "P6",
            "faculty": "-"
        },
        {
            "hour": 7,
            "code": "26CYB1002J",
            "title": "Chemistry Lab",
            "type": "Lab",
            "venue": "Chem Lab Block, 1st Fl, Lab 4",
            "slot": "P7",
            "faculty": "Dr. John Bosco A"
        },
        {
            "hour": 8,
            "code": "26CYB1002J",
            "title": "Chemistry Lab",
            "type": "Lab",
            "venue": "Chem Lab Block, 1st Fl, Lab 4",
            "slot": "P8",
            "faculty": "Dr. John Bosco A"
        },
        {
            "hour": 9,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "P9",
            "faculty": "-"
        },
        {
            "hour": 10,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "P10",
            "faculty": "-"
        },
        {
            "hour": 11,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "L11",
            "faculty": "-"
        },
        {
            "hour": 12,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "L12",
            "faculty": "-"
        }
    ],
    "Day 2": [
        {
            "hour": 1,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "P11",
            "faculty": "-"
        },
        {
            "hour": 2,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "P12",
            "faculty": "-"
        },
        {
            "hour": 3,
            "code": "26CSE1002J",
            "title": "Programming Lab (PPS)",
            "type": "Lab",
            "venue": "Tech Park 3rd Fl, Integrative Lab",
            "slot": "P13",
            "faculty": "Sheeba Rachel S"
        },
        {
            "hour": 4,
            "code": "26CSE1002J",
            "title": "Programming Lab (PPS)",
            "type": "Lab",
            "venue": "Tech Park 3rd Fl, Integrative Lab",
            "slot": "P14",
            "faculty": "Sheeba Rachel S"
        },
        {
            "hour": 5,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "P15",
            "faculty": "-"
        },
        {
            "hour": 6,
            "code": "26MAB1001T",
            "title": "Calculus & Linear Algebra",
            "type": "Theory",
            "venue": "UB 601",
            "slot": "B",
            "faculty": "Dr. N. Parvathi"
        },
        {
            "hour": 7,
            "code": "26MAB1001T",
            "title": "Calculus & Linear Algebra",
            "type": "Theory",
            "venue": "UB 601",
            "slot": "B",
            "faculty": "Dr. N. Parvathi"
        },
        {
            "hour": 8,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "G",
            "faculty": "-"
        },
        {
            "hour": 9,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "G",
            "faculty": "-"
        },
        {
            "hour": 10,
            "code": "26BTB1001T",
            "title": "Computational Biology",
            "type": "Theory",
            "venue": "UB 601",
            "slot": "A",
            "faculty": "Sivasankareswari E"
        },
        {
            "hour": 11,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "L21",
            "faculty": "-"
        },
        {
            "hour": 12,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "L22",
            "faculty": "-"
        }
    ],
    "Day 3": [
        {
            "hour": 1,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "C",
            "faculty": "-"
        },
        {
            "hour": 2,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "C",
            "faculty": "-"
        },
        {
            "hour": 3,
            "code": "26BTB1001T",
            "title": "Computational Biology",
            "type": "Theory",
            "venue": "UB 601",
            "slot": "A",
            "faculty": "Sivasankareswari E"
        },
        {
            "hour": 4,
            "code": "26CYB1002J",
            "title": "Chemistry Theory",
            "type": "Theory",
            "venue": "UB 601",
            "slot": "D",
            "faculty": "Dr. John Bosco A"
        },
        {
            "hour": 5,
            "code": "26MAB1001T",
            "title": "Calculus & Linear Algebra",
            "type": "Theory",
            "venue": "UB 601",
            "slot": "B",
            "faculty": "Dr. N. Parvathi"
        },
        {
            "hour": 6,
            "code": null,
            "title": "Lunch / Free",
            "type": "Free",
            "venue": "-",
            "slot": "P26",
            "faculty": "-"
        },
        {
            "hour": 7,
            "code": "26MEE1001L",
            "title": "Workshop Practice",
            "type": "Lab",
            "venue": "BEL Ground Floor, Sheet Metal Lab",
            "slot": "P27",
            "faculty": "Dr. Manoj Samson R"
        },
        {
            "hour": 8,
            "code": "26MEE1001L",
            "title": "Workshop Practice",
            "type": "Lab",
            "venue": "BEL Ground Floor, Sheet Metal Lab",
            "slot": "P28",
            "faculty": "Dr. Manoj Samson R"
        },
        {
            "hour": 9,
            "code": "26MEE1001L",
            "title": "Workshop Practice",
            "type": "Lab",
            "venue": "BEL Ground Floor, Sheet Metal Lab",
            "slot": "P29",
            "faculty": "Dr. Manoj Samson R"
        },
        {
            "hour": 10,
            "code": "26MEE1001L",
            "title": "Workshop Practice",
            "type": "Lab",
            "venue": "BEL Ground Floor, Sheet Metal Lab",
            "slot": "P30",
            "faculty": "Dr. Manoj Samson R"
        },
        {
            "hour": 11,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "L31",
            "faculty": "-"
        },
        {
            "hour": 12,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "L32",
            "faculty": "-"
        }
    ],
    "Day 4": [
        {
            "hour": 1,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "P31",
            "faculty": "-"
        },
        {
            "hour": 2,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "P32",
            "faculty": "-"
        },
        {
            "hour": 3,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "P33",
            "faculty": "-"
        },
        {
            "hour": 4,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "P34",
            "faculty": "-"
        },
        {
            "hour": 5,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "P35",
            "faculty": "-"
        },
        {
            "hour": 6,
            "code": "26CYB1002J",
            "title": "Chemistry Theory",
            "type": "Theory",
            "venue": "UB 601",
            "slot": "D",
            "faculty": "Dr. John Bosco A"
        },
        {
            "hour": 7,
            "code": "26CYB1002J",
            "title": "Chemistry Theory",
            "type": "Theory",
            "venue": "UB 601",
            "slot": "D",
            "faculty": "Dr. John Bosco A"
        },
        {
            "hour": 8,
            "code": "26MAB1001T",
            "title": "Calculus & Linear Algebra",
            "type": "Theory",
            "venue": "UB 601",
            "slot": "B",
            "faculty": "Dr. N. Parvathi"
        },
        {
            "hour": 9,
            "code": "26CSE1002J",
            "title": "Programming Theory (PPS)",
            "type": "Theory",
            "venue": "UB 601",
            "slot": "E",
            "faculty": "Sheeba Rachel S"
        },
        {
            "hour": 10,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "C",
            "faculty": "-"
        },
        {
            "hour": 11,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "L41",
            "faculty": "-"
        },
        {
            "hour": 12,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "L42",
            "faculty": "-"
        }
    ],
    "Day 5": [
        {
            "hour": 1,
            "code": "26CSE1002J",
            "title": "Programming Theory (PPS)",
            "type": "Theory",
            "venue": "UB 601",
            "slot": "E",
            "faculty": "Sheeba Rachel S"
        },
        {
            "hour": 2,
            "code": "26CSE1002J",
            "title": "Programming Theory (PPS)",
            "type": "Theory",
            "venue": "UB 601",
            "slot": "E",
            "faculty": "Sheeba Rachel S"
        },
        {
            "hour": 3,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "C",
            "faculty": "-"
        },
        {
            "hour": 4,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "F",
            "faculty": "-"
        },
        {
            "hour": 5,
            "code": "26CYB1002J",
            "title": "Chemistry Theory",
            "type": "Theory",
            "venue": "UB 601",
            "slot": "D",
            "faculty": "Dr. John Bosco A"
        },
        {
            "hour": 6,
            "code": null,
            "title": "Lunch / Free",
            "type": "Free",
            "venue": "-",
            "slot": "P46",
            "faculty": "-"
        },
        {
            "hour": 7,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "P47",
            "faculty": "-"
        },
        {
            "hour": 8,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "P48",
            "faculty": "-"
        },
        {
            "hour": 9,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "P49",
            "faculty": "-"
        },
        {
            "hour": 10,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "P50",
            "faculty": "-"
        },
        {
            "hour": 11,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "L51",
            "faculty": "-"
        },
        {
            "hour": 12,
            "code": null,
            "title": "Free Period",
            "type": "Free",
            "venue": "-",
            "slot": "L52",
            "faculty": "-"
        }
    ]
},
    calendar: [
    {
        "date": "21-07-2026",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 1",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "22-07-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 1",
        "day_order": "Day 2",
        "remarks": "-"
    },
    {
        "date": "23-07-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 1",
        "day_order": "Day 3",
        "remarks": "-"
    },
    {
        "date": "24-07-2026",
        "day": "Friday",
        "status": "Working day",
        "week": "Wk 1",
        "day_order": "Day 4",
        "remarks": "-"
    },
    {
        "date": "25-07-2026",
        "day": "Saturday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Saturday"
    },
    {
        "date": "26-07-2026",
        "day": "Sunday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Sunday"
    },
    {
        "date": "27-07-2026",
        "day": "Monday",
        "status": "Working day",
        "week": "Wk 1",
        "day_order": "Day 5",
        "remarks": "-"
    },
    {
        "date": "28-07-2026",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 2",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "29-07-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 2",
        "day_order": "Day 2",
        "remarks": "-"
    },
    {
        "date": "30-07-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 2",
        "day_order": "Day 3",
        "remarks": "-"
    },
    {
        "date": "31-07-2026",
        "day": "Friday",
        "status": "Working day",
        "week": "Wk 2",
        "day_order": "Day 4",
        "remarks": "-"
    },
    {
        "date": "01-08-2026",
        "day": "Saturday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Saturday"
    },
    {
        "date": "02-08-2026",
        "day": "Sunday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Sunday"
    },
    {
        "date": "03-08-2026",
        "day": "Monday",
        "status": "Working day",
        "week": "Wk 2",
        "day_order": "Day 5",
        "remarks": "-"
    },
    {
        "date": "04-08-2026",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 3",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "05-08-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 3",
        "day_order": "Day 2",
        "remarks": "-"
    },
    {
        "date": "06-08-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 3",
        "day_order": "Day 3",
        "remarks": "-"
    },
    {
        "date": "07-08-2026",
        "day": "Friday",
        "status": "Working day",
        "week": "Wk 3",
        "day_order": "Day 4",
        "remarks": "-"
    },
    {
        "date": "08-08-2026",
        "day": "Saturday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Saturday"
    },
    {
        "date": "09-08-2026",
        "day": "Sunday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Sunday"
    },
    {
        "date": "10-08-2026",
        "day": "Monday",
        "status": "Working day",
        "week": "Wk 3",
        "day_order": "Day 5",
        "remarks": "-"
    },
    {
        "date": "11-08-2026",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 4",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "12-08-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 4",
        "day_order": "Day 2",
        "remarks": "-"
    },
    {
        "date": "13-08-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 4",
        "day_order": "Day 3",
        "remarks": "-"
    },
    {
        "date": "14-08-2026",
        "day": "Friday",
        "status": "Working day",
        "week": "Wk 4",
        "day_order": "Day 4",
        "remarks": "-"
    },
    {
        "date": "15-08-2026",
        "day": "Saturday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Saturday"
    },
    {
        "date": "16-08-2026",
        "day": "Sunday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Sunday"
    },
    {
        "date": "17-08-2026",
        "day": "Monday",
        "status": "Working day",
        "week": "Wk 4",
        "day_order": "Day 5",
        "remarks": "-"
    },
    {
        "date": "18-08-2026Today",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 5",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "19-08-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 5",
        "day_order": "Day 2",
        "remarks": "-"
    },
    {
        "date": "20-08-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 5",
        "day_order": "Day 3",
        "remarks": "-"
    },
    {
        "date": "21-08-2026",
        "day": "Friday",
        "status": "Working day",
        "week": "Wk 5",
        "day_order": "Day 4",
        "remarks": "-"
    },
    {
        "date": "22-08-2026",
        "day": "Saturday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Saturday"
    },
    {
        "date": "23-08-2026",
        "day": "Sunday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Sunday"
    },
    {
        "date": "24-08-2026",
        "day": "Monday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Declared Campus Holiday"
    },
    {
        "date": "25-08-2026",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 5",
        "day_order": "Day 5",
        "remarks": "-"
    },
    {
        "date": "26-08-2026",
        "day": "Wednesday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Milad-un-nabi"
    },
    {
        "date": "27-08-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 6",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "28-08-2026",
        "day": "Friday",
        "status": "Working day",
        "week": "Wk 6",
        "day_order": "Day 2",
        "remarks": "-"
    },
    {
        "date": "29-08-2026",
        "day": "Saturday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Saturday"
    },
    {
        "date": "30-08-2026",
        "day": "Sunday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Sunday"
    },
    {
        "date": "31-08-2026",
        "day": "Monday",
        "status": "Working day",
        "week": "Wk 6",
        "day_order": "Day 3",
        "remarks": "-"
    },
    {
        "date": "01-09-2026",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 6",
        "day_order": "Day 4",
        "remarks": "-"
    },
    {
        "date": "02-09-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 7",
        "day_order": "Day 5",
        "remarks": "-"
    },
    {
        "date": "03-09-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 7",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "04-09-2026",
        "day": "Friday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Krishna Jayanthi"
    },
    {
        "date": "05-09-2026",
        "day": "Saturday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Saturday"
    },
    {
        "date": "06-09-2026",
        "day": "Sunday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Sunday"
    },
    {
        "date": "07-09-2026",
        "day": "Monday",
        "status": "Working day",
        "week": "Wk 7",
        "day_order": "Day 2",
        "remarks": "-"
    },
    {
        "date": "08-09-2026",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 7",
        "day_order": "Day 3",
        "remarks": "-"
    },
    {
        "date": "09-09-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 7",
        "day_order": "Day 4",
        "remarks": "-"
    },
    {
        "date": "10-09-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 8",
        "day_order": "Day 5",
        "remarks": "-"
    },
    {
        "date": "11-09-2026",
        "day": "Friday",
        "status": "Working day",
        "week": "Wk 8",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "12-09-2026",
        "day": "Saturday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Saturday"
    },
    {
        "date": "13-09-2026",
        "day": "Sunday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Sunday"
    },
    {
        "date": "14-09-2026",
        "day": "Monday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Vinayagar Chathurthi"
    },
    {
        "date": "15-09-2026",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 8",
        "day_order": "Day 3",
        "remarks": "-"
    },
    {
        "date": "16-09-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 8",
        "day_order": "Day 4",
        "remarks": "-"
    },
    {
        "date": "17-09-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 8",
        "day_order": "Day 5",
        "remarks": "-"
    },
    {
        "date": "18-09-2026",
        "day": "Friday",
        "status": "Working day",
        "week": "Wk 9",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "19-09-2026",
        "day": "Saturday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Saturday"
    },
    {
        "date": "20-09-2026",
        "day": "Sunday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Sunday"
    },
    {
        "date": "21-09-2026",
        "day": "Monday",
        "status": "Working day",
        "week": "Wk 9",
        "day_order": "Day 2",
        "remarks": "-"
    },
    {
        "date": "22-09-2026",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 9",
        "day_order": "Day 3",
        "remarks": "-"
    },
    {
        "date": "23-09-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 9",
        "day_order": "Day 4",
        "remarks": "-"
    },
    {
        "date": "24-09-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 9",
        "day_order": "Day 5",
        "remarks": "-"
    },
    {
        "date": "25-09-2026",
        "day": "Friday",
        "status": "Working day",
        "week": "Wk 10",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "26-09-2026",
        "day": "Saturday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Saturday"
    },
    {
        "date": "27-09-2026",
        "day": "Sunday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Sunday"
    },
    {
        "date": "28-09-2026",
        "day": "Monday",
        "status": "Working day",
        "week": "Wk 10",
        "day_order": "Day 2",
        "remarks": "-"
    },
    {
        "date": "29-09-2026",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 10",
        "day_order": "Day 3",
        "remarks": "-"
    },
    {
        "date": "30-09-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 10",
        "day_order": "Day 4",
        "remarks": "-"
    },
    {
        "date": "01-10-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 10",
        "day_order": "Day 5",
        "remarks": "-"
    },
    {
        "date": "02-10-2026",
        "day": "Friday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Gandhi Jayanthi"
    },
    {
        "date": "03-10-2026",
        "day": "Saturday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Saturday"
    },
    {
        "date": "04-10-2026",
        "day": "Sunday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Sunday"
    },
    {
        "date": "05-10-2026",
        "day": "Monday",
        "status": "Working day",
        "week": "Wk 11",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "06-10-2026",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 11",
        "day_order": "Day 2",
        "remarks": "-"
    },
    {
        "date": "07-10-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 11",
        "day_order": "Day 3",
        "remarks": "-"
    },
    {
        "date": "08-10-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 11",
        "day_order": "Day 4",
        "remarks": "-"
    },
    {
        "date": "09-10-2026",
        "day": "Friday",
        "status": "Working day",
        "week": "Wk 11",
        "day_order": "Day 5",
        "remarks": "-"
    },
    {
        "date": "10-10-2026",
        "day": "Saturday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Saturday"
    },
    {
        "date": "11-10-2026",
        "day": "Sunday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Sunday"
    },
    {
        "date": "12-10-2026",
        "day": "Monday",
        "status": "Working day",
        "week": "Wk 12",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "13-10-2026",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 12",
        "day_order": "Day 2",
        "remarks": "-"
    },
    {
        "date": "14-10-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 12",
        "day_order": "Day 3",
        "remarks": "-"
    },
    {
        "date": "15-10-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 12",
        "day_order": "Day 4",
        "remarks": "-"
    },
    {
        "date": "16-10-2026",
        "day": "Friday",
        "status": "Working day",
        "week": "Wk 12",
        "day_order": "Day 5",
        "remarks": "-"
    },
    {
        "date": "17-10-2026",
        "day": "Saturday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Saturday"
    },
    {
        "date": "18-10-2026",
        "day": "Sunday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Sunday"
    },
    {
        "date": "19-10-2026",
        "day": "Monday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Ayutha Pooja"
    },
    {
        "date": "20-10-2026",
        "day": "Tuesday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Vijaya Dasami"
    },
    {
        "date": "21-10-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 13",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "22-10-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 13",
        "day_order": "Day 2",
        "remarks": "-"
    },
    {
        "date": "23-10-2026",
        "day": "Friday",
        "status": "Working day",
        "week": "Wk 13",
        "day_order": "Day 3",
        "remarks": "-"
    },
    {
        "date": "24-10-2026",
        "day": "Saturday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Saturday"
    },
    {
        "date": "25-10-2026",
        "day": "Sunday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Sunday"
    },
    {
        "date": "26-10-2026",
        "day": "Monday",
        "status": "Working day",
        "week": "Wk 13",
        "day_order": "Day 4",
        "remarks": "-"
    },
    {
        "date": "27-10-2026",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 13",
        "day_order": "Day 5",
        "remarks": "-"
    },
    {
        "date": "28-10-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 14",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "29-10-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 14",
        "day_order": "Day 2",
        "remarks": "-"
    },
    {
        "date": "30-10-2026",
        "day": "Friday",
        "status": "Working day",
        "week": "Wk 14",
        "day_order": "Day 3",
        "remarks": "-"
    },
    {
        "date": "31-10-2026",
        "day": "Saturday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Saturday"
    },
    {
        "date": "01-11-2026",
        "day": "Sunday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Sunday"
    },
    {
        "date": "02-11-2026",
        "day": "Monday",
        "status": "Working day",
        "week": "Wk 14",
        "day_order": "Day 4",
        "remarks": "-"
    },
    {
        "date": "03-11-2026",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 14",
        "day_order": "Day 5",
        "remarks": "-"
    },
    {
        "date": "04-11-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 15",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "05-11-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 15",
        "day_order": "Day 2",
        "remarks": "-"
    },
    {
        "date": "06-11-2026",
        "day": "Friday",
        "status": "Working day",
        "week": "Wk 15",
        "day_order": "Day 3",
        "remarks": "-"
    },
    {
        "date": "07-11-2026",
        "day": "Saturday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Saturday"
    },
    {
        "date": "08-11-2026",
        "day": "Sunday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Sunday"
    },
    {
        "date": "09-11-2026",
        "day": "Monday",
        "status": "Working day",
        "week": "Wk 15",
        "day_order": "Day 4",
        "remarks": "-"
    },
    {
        "date": "10-11-2026",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 15",
        "day_order": "Day 5",
        "remarks": "-"
    },
    {
        "date": "11-11-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 16",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "12-11-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 16",
        "day_order": "Day 2",
        "remarks": "-"
    },
    {
        "date": "13-11-2026",
        "day": "Friday",
        "status": "Working day",
        "week": "Wk 16",
        "day_order": "Day 3",
        "remarks": "-"
    },
    {
        "date": "14-11-2026",
        "day": "Saturday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Saturday"
    },
    {
        "date": "15-11-2026",
        "day": "Sunday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Sunday"
    },
    {
        "date": "16-11-2026",
        "day": "Monday",
        "status": "Working day",
        "week": "Wk 16",
        "day_order": "Day 4",
        "remarks": "-"
    },
    {
        "date": "17-11-2026",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 16",
        "day_order": "Day 5",
        "remarks": "-"
    },
    {
        "date": "18-11-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 17",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "19-11-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 17",
        "day_order": "Day 2",
        "remarks": "-"
    },
    {
        "date": "20-11-2026",
        "day": "Friday",
        "status": "Working day",
        "week": "Wk 17",
        "day_order": "Day 3",
        "remarks": "Last Working Day - PG"
    },
    {
        "date": "21-11-2026",
        "day": "Saturday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Saturday"
    },
    {
        "date": "22-11-2026",
        "day": "Sunday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Sunday"
    },
    {
        "date": "23-11-2026",
        "day": "Monday",
        "status": "Working day",
        "week": "Wk 17",
        "day_order": "Day 4",
        "remarks": "-"
    },
    {
        "date": "24-11-2026",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 17",
        "day_order": "Day 5",
        "remarks": "-"
    },
    {
        "date": "25-11-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 18",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "26-11-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 18",
        "day_order": "Day 2",
        "remarks": "-"
    },
    {
        "date": "27-11-2026",
        "day": "Friday",
        "status": "Working day",
        "week": "Wk 18",
        "day_order": "Day 3",
        "remarks": "-"
    },
    {
        "date": "28-11-2026",
        "day": "Saturday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Saturday"
    },
    {
        "date": "29-11-2026",
        "day": "Sunday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Sunday"
    },
    {
        "date": "30-11-2026",
        "day": "Monday",
        "status": "Working day",
        "week": "Wk 18",
        "day_order": "Day 4",
        "remarks": "-"
    },
    {
        "date": "01-12-2026",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 18",
        "day_order": "Day 5",
        "remarks": "-"
    },
    {
        "date": "02-12-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 19",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "03-12-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 19",
        "day_order": "Day 2",
        "remarks": "-"
    },
    {
        "date": "04-12-2026",
        "day": "Friday",
        "status": "Working day",
        "week": "Wk 19",
        "day_order": "Day 3",
        "remarks": "-"
    },
    {
        "date": "05-12-2026",
        "day": "Saturday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Saturday"
    },
    {
        "date": "06-12-2026",
        "day": "Sunday",
        "status": "Holiday",
        "week": "Wk 0",
        "day_order": "-",
        "remarks": "Sunday"
    },
    {
        "date": "07-12-2026",
        "day": "Monday",
        "status": "Working day",
        "week": "Wk 19",
        "day_order": "Day 4",
        "remarks": "Last Working Day - UG First Year"
    }
]
,
    passport: {
        facultyAdvisor: {
            name: "DR. PRITHI S",
            empId: "103905",
            designation: "Faculty Advisor & Academic Counselor",
            department: "Department of Computer Science & Engineering",
            cabin: "University Building (UB) 6th Floor, Room 601 (Annexure-II)",
            email: "prithis@srmist.edu.in",
            phone: "+91 44 2741 7000"
        },
        subBatch: "Section P1 • Batch 1",
        curriculum: {
            regulation: "Regulation 2021 (NEP Model)",
            totalCreditsReq: 160,
            earnedCredits: 22,
            cgpaGoal: 9.00
        },
        creditCategories: [
            { category: "Basic Science Courses (BSC)", completed: 10, total: 28, color: "#38bdf8" },
            { category: "Engineering Science Courses (ESC)", completed: 8, total: 24, color: "#a855f7" },
            { category: "Professional Core Courses (PCC)", completed: 4, total: 68, color: "#22c55e" },
            { category: "Professional Electives (PEC)", completed: 0, total: 18, color: "#f59e0b" },
            { category: "Open Electives (OEC)", completed: 0, total: 12, color: "#ec4899" },
            { category: "Mandatory Non-Credit (MC)", completed: 2, total: 10, color: "#14b8a6" }
        ],
        hostel: {
            allocatedBlock: "Adhiyaman",
            roomNumber: "Room 335",
            bed: "Allotted",
            allocatedDate: "24-Jun-2026",
            academicYear: "2026-2027",
            ambulanceHotline: "044-27453140 / 108 (SRM Hospital Casualty)"
        },
        clearances: {
            tuitionFeeStatus: "Paid (Cleared)",
            hostelFeeStatus: "Paid (₹2,30,500 • PayU Verified)",
            libraryNoDues: "Clear (0 Fines Pending)",
            labBreakageStatus: "Clear (0 Damaged Equipments)"
        }
    },
    hostelMess: {
        "hostels": [
                "M Block Mess (Girls Dining Hall)",
                "Sannasi Mess (Boys Dining Hall)",
                "Paari Block Mess (Boys Dining Hall)",
                "Kaveri Block Mess (Boys Dining Hall)",
                "Agasthya Mess (Boys Dining Hall)",
                "Senbagam Mess (Girls Dining Hall)",
                "Kalpana Chawla Mess (Girls Dining Hall)"
],
        "timings": {
                "breakfast": {
                        "label": "Breakfast",
                        "start": "07:30",
                        "end": "09:30",
                        "icon": "BF"
                },
                "lunch": {
                        "label": "Lunch",
                        "start": "12:00",
                        "end": "14:15",
                        "icon": "LN"
                },
                "snacks": {
                        "label": "Evening Tea & Snacks",
                        "start": "16:30",
                        "end": "17:45",
                        "icon": "SN"
                },
                "dinner": {
                        "label": "Dinner",
                        "start": "19:30",
                        "end": "21:30",
                        "icon": "DN"
                }
        },
        "menus": {
                "SANNASI_BOYS": {
                        "Monday": {
                                "breakfast": "Ven Pongal, Tiffin Sambar, Coconut Chutney, Medu Vada, Masala Omelette / Whole Wheat Bread Omelette (1 No), Bread, Butter, Jam, Milk, Filter Coffee, Plain Tea, Banana",
                                "lunch": "Methi Chappathi, Black Channa Masala, Lemon Rice / Tamarind Rice, Dal Fry Tadka, Steamed Rice, Arachuvitta Sambar, Keerai Kootu, Lemon Rasam, Curd (100 ml), Paruppu Podi, Ghee, Oil, Frymes, Appalam, Pickle, Buttermilk, Payasam",
                                "snacks": "Samosa / Veg Roll (1 No), Tea, Whole Wheat Bread, Butter, Jam",
                                "dinner": "Bagara Pulao / Idli, Raita / Chutney, Chappathi, Paneer Gravy / Baby Corn Gravy, Steamed Rice, Pumpkin Sambar, Rasam, Buttermilk, Pickle, Green Salad, Milk, Andhra Chicken Curry (120 gm) / Fish Fry (1 No) & Fish Gravy (Non-Veg)"
                        },
                        "Tuesday": {
                                "breakfast": "Veg Rava Kitchadi / Vegetable Upma, Vegetable Sambar, Red Chilli Coconut Chutney, Poori, Aloo Masala, Boiled Egg (1 No), Whole Wheat Bread, Butter, Jam, Milk, Filter Coffee, Plain Tea, Seasonal Fruits",
                                "lunch": "Chappathi, White Peas Curry, Jeera Pulao, Dal Fry Tadka, Steamed Rice, Karakuzhambu / More Kuzhambu, Urulai Kara Curry, Tomato Rasam, Curd (100 ml), Paruppu Podi, Ghee, Oil, Frymes, Appalam, Pickle, Buttermilk, Sweet (Gulab Jamun)",
                                "snacks": "Pani Puri (5 Nos) / Pav Bhaji (1 No), Tea, Whole Wheat Bread, Butter, Jam",
                                "dinner": "Onion Uthappam, Kara Chutney, Millet Chappathi, Dal Pancharathan, Idli Podi, Steamed Rice, Radish Sambar, Lemon Rasam, Buttermilk, Pickle, Green Salad, Milk, Egg Gravy (Non-Veg)"
                        },
                        "Wednesday": {
                                "breakfast": "Idiyappam, Vada Curry / Veg Stew, Poha, Mint Chutney, Whole Wheat Bread, Butter, Jam, Milk, Filter Coffee, Plain Tea, Banana",
                                "lunch": "Beetroot Chappathi, Rajma Masala, Corn / Mint / Tomato Rice, Dal Fry, Steamed Rice, Sambar, Veg Poriyal / Kootu, Garlic Rasam, Curd (100 ml), Paruppu Podi, Ghee, Oil, Frymes, Appalam, Pickle, Buttermilk, Payasam",
                                "snacks": "Cream Bun (1 No) / Osmania Biscuits (2 Nos), Rose Milk / Badam Milk, Tea, Whole Wheat Bread, Butter, Jam",
                                "dinner": "Kal Dosa, Tomato Chutney, Chappathi, Paneer Butter Masala, Steamed Rice, Kathirikai Sambar, Garlic Rasam, Buttermilk, Pickle, Green Salad, Milk, Arun Choco Bar / Cone Ice Cream (1 No), Chicken Gravy / Chicken Biryani (with Boiled Egg - 1 No) (Non-Veg)"
                        },
                        "Thursday": {
                                "breakfast": "Idli, Urad Sambar, Groundnut Chutney, Medu Vada, Corn Flakes, Idli Podi, Oil, Boiled Egg (1 No), Whole Wheat Bread, Butter, Jam, Milk, Filter Coffee, Plain Tea, Banana",
                                "lunch": "Chappathi, Vegetable Jalfrezi, Tomato Pulao, Tomato Dal Fry, Steamed Rice, Vathakuzhambu, Vegetable Kootu, Ginger Rasam, Curd (100 ml), Paruppu Podi, Ghee, Oil, Frymes, Appalam, Pickle, Buttermilk, Sweet (Boondi)",
                                "snacks": "Masala Sundal (100 ml), Filter Coffee, Tea, Whole Wheat Bread, Butter, Jam",
                                "dinner": "Uthappam, Vegetable Chutney, Chole Poori, Channa Masala, Steamed Rice, Drumstick Sambar, Tomato Rasam, Buttermilk, Pickle, Green Salad, Milk, Chettinadu Mutton Kuzhambu / Flavored Gravy (Non-Veg)"
                        },
                        "Friday": {
                                "breakfast": "Kal Dosa, Tiffin Sambar, Onion / Tomato Chutney, Semiya Bath, Boiled Omelette / Whole Wheat Bread Omelette (1 No), Whole Wheat Bread, Butter, Jam, Milk, Filter Coffee, Plain Tea, Banana",
                                "lunch": "Chappathi, Aloo Palak, Methi Pulao / Tamarind Rice, Dal Tadka, Steamed Rice, Sambar, Beetroot Poriyal, Jeera Rasam, Curd (100 ml), Paruppu Podi, Ghee, Oil, Frymes, Appalam, Pickle, Buttermilk, Sweet (Kesari)",
                                "snacks": "Murukku (2 Nos), Mint Lemon Juice, Filter Coffee, Tea, Whole Wheat Bread, Butter, Jam",
                                "dinner": "Pasta (Bechamel / Arrabiata) / Veg Schezwan Fried Rice, Manchurian, Soup, Chappathi, Kadai Vegetables, Steamed Rice, Pepper Rasam, Buttermilk, Pickle, Green Salad, Milk, Chicken Gravy (Non-Veg)"
                        },
                        "Saturday": {
                                "breakfast": "Idli, Chinna Vengaya Sambar, Groundnut Chutney, Aloo Paratha, Curd (100 ml), Idli Podi, Oil, Boiled Egg (1 No), Whole Wheat Bread, Butter, Jam, Milk, Filter Coffee, Plain Tea, Banana",
                                "lunch": "Chappathi, Vegetable Kurma, Soya Mattar Dum Biryani, Raita, Dal Fry, Steamed Rice, Chettinad Sambar, Keerai Kootu, Tomato Rasam, Curd (100 ml), Paruppu Podi, Ghee, Oil, Frymes, Appalam, Pickle, Buttermilk, Sweet (Gulab Jamun / Badusha)",
                                "snacks": "Eggless Cake / Brownie (1 No), Filter Coffee, Tea, Whole Wheat Bread, Butter, Jam",
                                "dinner": "Kal Dosa, Chutney, Parotta, Veg Kurma, Idli Podi, Steamed Rice, Karakuzhambu, Garlic Rasam, Buttermilk, Pickle, Green Salad, Milk, Chicken Gravy (Non-Veg)"
                        },
                        "Sunday": {
                                "breakfast": "Chole Bhature, Channa Masala, Kal Dosa, Coconut Chutney, Sambar, Idli Podi, Oil, Egg Kal Dosa (1 No), Whole Wheat Bread, Butter, Jam, Milk, Filter Coffee, Plain Tea, Banana",
                                "lunch": "Chappathi, Chicken Curry (with 120 gm Chicken) (Non-Veg) / Paneer Gravy (Veg), Steamed Rice, Beetroot Poriyal, Dal Rasam, Curd (100 ml), Frymes, Pickle, Buttermilk, Arun Cup Ice Cream (1 No)",
                                "snacks": "Channa Sundal (White / Black - 100 ml), Filter Coffee, Tea, Whole Wheat Bread, Butter, Jam",
                                "dinner": "Dal Kitchadi, Chappathi, Veg Kurma, Poriyal, Steamed Rice, Kadamba Sambar, Rasam, Buttermilk, Pickle, Green Salad, Milk, Chicken Gravy (Non-Veg)"
                        }
                },
                "M_BLOCK_GIRLS": {
                        "Monday": {
                                                "breakfast": "Sweet, Bread, Butter, Jam, Idly, Sambar, Spl Chutney, Poori, Aloo Dal Masala, Tea / Coffee / Milk, Boiled Egg, Banana",
                                                "lunch": "Chapathi, Chana Salna, Jeera Pulao, Steamed Rice, Masala Sambar, Bagara Dal, Mix Veg Usal, Lemon Rasam, Pickle, Butter Milk, Fryums",
                                                "snacks": "Pav Baji, Tea / Coffee",
                                                "dinner": "Punjabi Paratha, Rajma Masala Wala, Dosa, Idly Podi, Oil, Special Chutney, Steamed Rice, Vegetable Dal, Rasam, Pickle, Fryums, Veg Salad, Chicken Gravy"
                        },
                        "Tuesday": {
                                                "breakfast": "Bread, Butter, Jam, Ghee Pongu, Vadai, Veg Kosthu, Coconut Chutney, Puttu, Mint Chutney, Tea / Coffee / Milk, Masala Omlet",
                                                "lunch": "Sweet, Poori, Muttar Mughlai, Variety Rice, Steamed Rice, Sambar, Dal Lauki, Tomato Rasam, Curd, 65 / Bhindi Jaipuri, Fryums, Butter Milk, Pickle",
                                                "snacks": "Boiled Peanut / Black Channa Sundal, Tea / Coffee",
                                                "dinner": "Chapathi, Mix Veg Khurma, Fried Rice / Noodles, Manchurian Dry / Crispy Vegetable, Steamed Rice, Rasam, Dal Fry, Pickle, Fryums, Veg Salad, Milk, Spl Fruits, Chicken Gravy"
                        },
                        "Wednesday": {
                                                "breakfast": "Bread, Butter, Jam, Dosa, Idly, Podi, Oil, Arachuvitta Sambar, Chutney, Coconut Aloo Poriyal, Milagai, Tea / Coffee / Milk, Banana",
                                                "lunch": "Butter Roti, Aloo Palak, Peas Pulao, Dal Makhni, Kadi Vegetable, Steamed Rice, Drumstick Bhajiya Sambar, Ghee Rasam, Pickle, Fryums, Butter Milk",
                                                "snacks": "Veg Puff / Sweet Bun, Juice (or) Tea / Coffee",
                                                "dinner": "Chapathi, Steamed Rice, Dal Tadka, Chicken Masala (Non-Veg) / Paneer Butter Masala, Rasam, Pickle, Fryums, Veg Salad, Milk, Ice Cream, Chicken Gravy"
                        },
                        "Thursday": {
                                                "breakfast": "Bread, Butter, Jam, Chapathi, Aloo Meal Maker Masala, Veg Salna, Kootu, Coconut Chutney, Boiled Egg, Tea / Coffee / Milk",
                                                "lunch": "Luchi, Kashmiri Dum Aloo, Onion Pulao, Steamed Rice, Moong Dal Fry, Kadi Pakoda, Pepper Rasam, Poriyal, Pickle, Fryums, Butter Milk",
                                                "snacks": "Parle-G Pori / Chunda Naka, Tea / Coffee",
                                                "dinner": "Ghee Pulao / Kaju Pulao (Basmati Rice), Chapathi, Muttar Paneer, Steamed Rice, Dal Tadka, Rasam, Aloo Peanut Masala, Fryums, Pickle, Veg Salad, Milk, Ice Cream, Mutton Gravy"
                        },
                        "Friday": {
                                                "breakfast": "Bread, Butter, Jam, Podi Dosa, Idly Podi, Oil, Chilli Sambar, Chutney, Chapathi, Matar Masala, Tea / Coffee / Milk, Boiled Egg, Banana",
                                                "lunch": "Dry Jamun / Bread Halwa, Veg Biryani, Mix Raitha, Bisibeleabath, Gourd Rice, Steamed Rice, Tomato Rasam, Aloo Gobi Aadrak, Moongdal Tadka, Pickle, Fryums",
                                                "snacks": "Bonda / Vada, Chutney, Tea / Coffee",
                                                "dinner": "Chole Bhatura, Steamed Rice, Tomato Dal, Sambar, Rava Upma, Coconut Chutney, Rasam, Cabbage Poriyal, Pickle, Fryums, Veg Salad, Milk, Chicken Gravy"
                        },
                        "Saturday": {
                                                "breakfast": "Bread, Butter, Jam, Chapathi, Veg Khurma, Idiyappam (Lemon or Masala), Coconut Chutney, Tea / Coffee / Milk, Boiled Egg",
                                                "lunch": "Poori, Dal Aloo Masala, Veg Pulao, Steamed Rice, Punjabi Dal Tadka, Bhindi Do Pyasa, Kara Kuzhambu, Kootu, Jeera Rasam, Pickle, Special Fryums, Butter Milk",
                                                "snacks": "Cake (or) Brownie, Tea / Coffee",
                                                "dinner": "Sweet, Malabar Chapathi, Meal Maker Curry, Mix Vegetable Sabji, Steamed Rice, Dal Makhni, Idly, Idly Podi, Oil, Chutney, Tiffin Sambar, Rasam, Pickle, Fryums, Veg Salad, Special Fruit, Fried Fish"
                        },
                        "Sunday": {
                                                "breakfast": "Bread, Butter, Jam, Onion Poori, Veg Upma, Coconut Chutney, Tea / Coffee / Milk",
                                                "lunch": "Chapathi, Chicken (Pepper / Kadai), Paneer Butter Masala (or) Kadai Paneer, Dal Dhadka, Mint Pulao, Steamed Rice, Garlic Rasam, Poriyal, Pickle, Fryums, Butter Milk, Chicken Gravy",
                                                "snacks": "Corn / Bajji, Chutney, Tea / Coffee",
                                                "dinner": "Variety Sikku Paratha, Curd, Sambar, Rice, Haleem, Moong Dal Tadka, Kathamba Sambar, Poriyal, Rasam, Pickle, Fryums, Veg Salad, Milk, Ice Cream, Chicken Gravy"
                        }
}
        },
        "specialNotes": "MONTHLY TWICE (or) 4th WEDNESDAY WE PROVIDE CHICKEN BIRYANI & PANNEER BIRYANI\nNote: Special Items (Chicken, Egg, Fruit, Ice Cream, Sweet) are limited & menu is planned based on seasonal vegetable availability.",
        "weeklyMenu": {
                "Monday": {
                        "breakfast": "Ven Pongal, Tiffin Sambar, Coconut Chutney, Medu Vada, Masala Omelette / Whole Wheat Bread Omelette (1 No), Bread, Butter, Jam, Milk, Filter Coffee, Plain Tea, Banana",
                        "lunch": "Methi Chappathi, Black Channa Masala, Lemon Rice / Tamarind Rice, Dal Fry Tadka, Steamed Rice, Arachuvitta Sambar, Keerai Kootu, Lemon Rasam, Curd (100 ml), Paruppu Podi, Ghee, Oil, Frymes, Appalam, Pickle, Buttermilk, Payasam",
                        "snacks": "Samosa / Veg Roll (1 No), Tea, Whole Wheat Bread, Butter, Jam",
                        "dinner": "Bagara Pulao / Idli, Raita / Chutney, Chappathi, Paneer Gravy / Baby Corn Gravy, Steamed Rice, Pumpkin Sambar, Rasam, Buttermilk, Pickle, Green Salad, Milk, Andhra Chicken Curry (120 gm) / Fish Fry (1 No) & Fish Gravy (Non-Veg)"
                },
                "Tuesday": {
                        "breakfast": "Veg Rava Kitchadi / Vegetable Upma, Vegetable Sambar, Red Chilli Coconut Chutney, Poori, Aloo Masala, Boiled Egg (1 No), Whole Wheat Bread, Butter, Jam, Milk, Filter Coffee, Plain Tea, Seasonal Fruits",
                        "lunch": "Chappathi, White Peas Curry, Jeera Pulao, Dal Fry Tadka, Steamed Rice, Karakuzhambu / More Kuzhambu, Urulai Kara Curry, Tomato Rasam, Curd (100 ml), Paruppu Podi, Ghee, Oil, Frymes, Appalam, Pickle, Buttermilk, Sweet (Gulab Jamun)",
                        "snacks": "Pani Puri (5 Nos) / Pav Bhaji (1 No), Tea, Whole Wheat Bread, Butter, Jam",
                        "dinner": "Onion Uthappam, Kara Chutney, Millet Chappathi, Dal Pancharathan, Idli Podi, Steamed Rice, Radish Sambar, Lemon Rasam, Buttermilk, Pickle, Green Salad, Milk, Egg Gravy (Non-Veg)"
                },
                "Wednesday": {
                        "breakfast": "Idiyappam, Vada Curry / Veg Stew, Poha, Mint Chutney, Whole Wheat Bread, Butter, Jam, Milk, Filter Coffee, Plain Tea, Banana",
                        "lunch": "Beetroot Chappathi, Rajma Masala, Corn / Mint / Tomato Rice, Dal Fry, Steamed Rice, Sambar, Veg Poriyal / Kootu, Garlic Rasam, Curd (100 ml), Paruppu Podi, Ghee, Oil, Frymes, Appalam, Pickle, Buttermilk, Payasam",
                        "snacks": "Cream Bun (1 No) / Osmania Biscuits (2 Nos), Rose Milk / Badam Milk, Tea, Whole Wheat Bread, Butter, Jam",
                        "dinner": "Kal Dosa, Tomato Chutney, Chappathi, Paneer Butter Masala, Steamed Rice, Kathirikai Sambar, Garlic Rasam, Buttermilk, Pickle, Green Salad, Milk, Arun Choco Bar / Cone Ice Cream (1 No), Chicken Gravy / Chicken Biryani (with Boiled Egg - 1 No) (Non-Veg)"
                },
                "Thursday": {
                        "breakfast": "Idli, Urad Sambar, Groundnut Chutney, Medu Vada, Corn Flakes, Idli Podi, Oil, Boiled Egg (1 No), Whole Wheat Bread, Butter, Jam, Milk, Filter Coffee, Plain Tea, Banana",
                        "lunch": "Chappathi, Vegetable Jalfrezi, Tomato Pulao, Tomato Dal Fry, Steamed Rice, Vathakuzhambu, Vegetable Kootu, Ginger Rasam, Curd (100 ml), Paruppu Podi, Ghee, Oil, Frymes, Appalam, Pickle, Buttermilk, Sweet (Boondi)",
                        "snacks": "Masala Sundal (100 ml), Filter Coffee, Tea, Whole Wheat Bread, Butter, Jam",
                        "dinner": "Uthappam, Vegetable Chutney, Chole Poori, Channa Masala, Steamed Rice, Drumstick Sambar, Tomato Rasam, Buttermilk, Pickle, Green Salad, Milk, Chettinadu Mutton Kuzhambu / Flavored Gravy (Non-Veg)"
                },
                "Friday": {
                        "breakfast": "Kal Dosa, Tiffin Sambar, Onion / Tomato Chutney, Semiya Bath, Boiled Omelette / Whole Wheat Bread Omelette (1 No), Whole Wheat Bread, Butter, Jam, Milk, Filter Coffee, Plain Tea, Banana",
                        "lunch": "Chappathi, Aloo Palak, Methi Pulao / Tamarind Rice, Dal Tadka, Steamed Rice, Sambar, Beetroot Poriyal, Jeera Rasam, Curd (100 ml), Paruppu Podi, Ghee, Oil, Frymes, Appalam, Pickle, Buttermilk, Sweet (Kesari)",
                        "snacks": "Murukku (2 Nos), Mint Lemon Juice, Filter Coffee, Tea, Whole Wheat Bread, Butter, Jam",
                        "dinner": "Pasta (Bechamel / Arrabiata) / Veg Schezwan Fried Rice, Manchurian, Soup, Chappathi, Kadai Vegetables, Steamed Rice, Pepper Rasam, Buttermilk, Pickle, Green Salad, Milk, Chicken Gravy (Non-Veg)"
                },
                "Saturday": {
                        "breakfast": "Idli, Chinna Vengaya Sambar, Groundnut Chutney, Aloo Paratha, Curd (100 ml), Idli Podi, Oil, Boiled Egg (1 No), Whole Wheat Bread, Butter, Jam, Milk, Filter Coffee, Plain Tea, Banana",
                        "lunch": "Chappathi, Vegetable Kurma, Soya Mattar Dum Biryani, Raita, Dal Fry, Steamed Rice, Chettinad Sambar, Keerai Kootu, Tomato Rasam, Curd (100 ml), Paruppu Podi, Ghee, Oil, Frymes, Appalam, Pickle, Buttermilk, Sweet (Gulab Jamun / Badusha)",
                        "snacks": "Eggless Cake / Brownie (1 No), Filter Coffee, Tea, Whole Wheat Bread, Butter, Jam",
                        "dinner": "Kal Dosa, Chutney, Parotta, Veg Kurma, Idli Podi, Steamed Rice, Karakuzhambu, Garlic Rasam, Buttermilk, Pickle, Green Salad, Milk, Chicken Gravy (Non-Veg)"
                },
                "Sunday": {
                        "breakfast": "Chole Bhature, Channa Masala, Kal Dosa, Coconut Chutney, Sambar, Idli Podi, Oil, Egg Kal Dosa (1 No), Whole Wheat Bread, Butter, Jam, Milk, Filter Coffee, Plain Tea, Banana",
                        "lunch": "Chappathi, Chicken Curry (with 120 gm Chicken) (Non-Veg) / Paneer Gravy (Veg), Steamed Rice, Beetroot Poriyal, Dal Rasam, Curd (100 ml), Frymes, Pickle, Buttermilk, Arun Cup Ice Cream (1 No)",
                        "snacks": "Channa Sundal (White / Black - 100 ml), Filter Coffee, Tea, Whole Wheat Bread, Butter, Jam",
                        "dinner": "Dal Kitchadi, Chappathi, Veg Kurma, Poriyal, Steamed Rice, Kadamba Sambar, Rasam, Buttermilk, Pickle, Green Salad, Milk, Chicken Gravy (Non-Veg)"
                }
        }
},
    campusClubs: [
        {
            id: "acm-ktr",
            name: "ACM SRM Student Chapter",
            category: "Technical",
            icon: "TECH",
            tagline: "Computing, Competitive Coding & Flagship Hackathons",
            leads: "Devanshi • Chair & Tech Team",
            members: "420+ Members • Tech Park 7th Floor",
            instagram: "https://instagram.com/acm_srmist",
            recruitStatus: "Recruitments Open (Tech & Non-Tech)",
            recruitLink: "https://docs.google.com/forms/d/e/1FAIpQLScsrm_acm_recruit/viewform",
            featuredEvent: "ACM ICPC AlgoSprint & DevHack 2026 (Registrations Live)"
        },
        {
            id: "ieee-ktr",
            name: "IEEE SRM Student Branch",
            category: "Technical",
            icon: "ELEC",
            tagline: "Advancing Technology for Humanity • Hardware & Robotics",
            leads: "Aarav • Student Branch Chair",
            members: "550+ Members • BEL Ground Floor Lab",
            instagram: "https://instagram.com/ieeesrmist",
            recruitStatus: "Auditions Active (Hardware, IoT, Web)",
            recruitLink: "https://docs.google.com/forms/d/e/1FAIpQLScieee_recruit/viewform",
            featuredEvent: "RoboSprint & IEEE Xtreme Coding Bootcamp"
        },
        {
            id: "gdg-ktr",
            name: "Google Developer Groups (GDG KTR)",
            category: "Technical",
            icon: "CLOUD",
            tagline: "Google Technologies, Android, Flutter & Cloud Architecture",
            leads: "Kavya • Community Lead",
            members: "800+ Members • UB Auditorium",
            instagram: "https://instagram.com/gdg_srmist",
            recruitStatus: "Core Team & Volunteer Forms Live",
            recruitLink: "https://docs.google.com/forms/d/e/1FAIpQLScgdg_recruit/viewform",
            featuredEvent: "Google Solution Challenge 2026 Hackathon"
        },
        {
            id: "camber-racing",
            name: "Camber Racing",
            category: "Motorsports",
            icon: "RACE",
            tagline: "Official Formula Student Combustion & EV Racing Team",
            leads: "Rohan • Technical Director",
            members: "Automobile Workshop Lab • Tech Park",
            instagram: "https://instagram.com/camberracing",
            recruitStatus: "Engineering Design & Dynamics Recruitments",
            recruitLink: "https://docs.google.com/forms/d/e/1FAIpQLSccamber_recruit/viewform",
            featuredEvent: "Formula Bharat 2026 Car Unveiling & Testing"
        },
        {
            id: "alexa-devs",
            name: "Alexa Developers SRM",
            category: "Technical",
            icon: "VOICE",
            tagline: "Voice AI, Ambient Computing & Full-Stack Systems",
            leads: "Siddharth • Lead Architect",
            members: "350+ Members",
            instagram: "https://instagram.com/alexadev_srm",
            recruitStatus: "Recruiting Voice, App & Design Leads",
            recruitLink: "https://docs.google.com/forms/d/e/1FAIpQLScalexa_recruit/viewform",
            featuredEvent: "VoiceCraft 4.0 Hackathon"
        },
        {
            id: "aaruush-milan",
            name: "Aaruush & Milan National Fests",
            category: "Cultural",
            icon: "FEST",
            tagline: "SRM National Techno-Management & Cultural Extravaganza",
            leads: "Directorate of Student Affairs (DSA)",
            members: "TP Ganesan Auditorium & Main Grounds",
            instagram: "https://instagram.com/aaruush_srmist",
            recruitStatus: "Committee Head & OD Volunteer Registrations",
            recruitLink: "https://docs.google.com/forms/d/e/1FAIpQLScaaruush_dsa/viewform",
            featuredEvent: "Aaruush Highlights & Pro-Nites Ticket Portal"
        },
        {
            id: "dsc-srm",
            name: "Data Science Community SRM",
            category: "Technical",
            icon: "DATA",
            tagline: "Machine Learning, Deep Learning, Kaggle & NLP",
            leads: "Tanmay • Community Lead",
            members: "400+ Members",
            instagram: "https://instagram.com/datascience_srm",
            recruitStatus: "Research & Development Auditions",
            recruitLink: "https://docs.google.com/forms/d/e/1FAIpQLScdsc_recruit/viewform",
            featuredEvent: "DataCon AI Challenge"
        }
    ],
    gradeScale: [
        { grade: "O", points: 10, label: "Outstanding (90 - 100%)", color: "#22c55e" },
        { grade: "A+", points: 9, label: "Excellent (80 - 89%)", color: "#38bdf8" },
        { grade: "A", points: 8, label: "Very Good (70 - 79%)", color: "#818cf8" },
        { grade: "B+", points: 7, label: "Good (60 - 69%)", color: "#f59e0b" },
        { grade: "B", points: 6, label: "Above Average (50 - 59%)", color: "#fb923c" },
        { grade: "C", points: 5, label: "Average (45 - 49%)", color: "#a1a1aa" },
        { grade: "F", points: 0, label: "Fail (<45%)", color: "#ef4444" }
    ],
    avatarDecorationFrames: [
        {
                "id": "frame-balance",
                "name": "Balance",
                "category": "Royal",
                "tag": "24K Royal Gold",
                "color": "#fbbf24",
                "tier": "S+ Tier",
                "tierBadge": "\ud83d\udc51 S+ TIER",
                "tierColor": "#ff4655",
                "tierRank": 1,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_82e4df4028396ad5ccaaafb397fa6248.png?size=240&passthrough=true"
        },
        {
                "id": "frame-the-hexcore",
                "name": "The Hexcore",
                "category": "Game",
                "tag": "Esports & Gaming",
                "color": "#06b6d4",
                "tier": "S+ Tier",
                "tierBadge": "\ud83d\udc51 S+ TIER",
                "tierColor": "#ff4655",
                "tierRank": 1,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_dbb1abd90367c1a31a94f7e162f3a3c3.png?size=240&passthrough=true"
        },
        {
                "id": "frame-phoenix",
                "name": "Phoenix",
                "category": "Dragon",
                "tag": "Mythic & Dragon",
                "color": "#ef4444",
                "tier": "S+ Tier",
                "tierBadge": "\ud83d\udc51 S+ TIER",
                "tierColor": "#ff4655",
                "tierRank": 1,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_0e839cd79500e7b68e2bbbed54790c28.png?size=240&passthrough=true"
        },
        {
                "id": "frame-akuma",
                "name": "Akuma",
                "category": "Dragon",
                "tag": "Mythic & Dragon",
                "color": "#ef4444",
                "tier": "S+ Tier",
                "tierBadge": "\ud83d\udc51 S+ TIER",
                "tierColor": "#ff4655",
                "tierRank": 1,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_1e8cb6070b13f775a41384c84c5a53e1.png?size=240&passthrough=true"
        },
        {
                "id": "frame-malefic-crown",
                "name": "Malefic Crown",
                "category": "Royal",
                "tag": "24K Royal Gold",
                "color": "#fbbf24",
                "tier": "S+ Tier",
                "tierBadge": "\ud83d\udc51 S+ TIER",
                "tierColor": "#ff4655",
                "tierRank": 1,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_d1ea7b8650bf3d64a03304c2ceb7d089.png?size=240&passthrough=true"
        },
        {
                "id": "frame-starlight-whales",
                "name": "Starlight Whales",
                "category": "Cosmic",
                "tag": "Cosmic & Galaxy",
                "color": "#c084fc",
                "tier": "S+ Tier",
                "tierBadge": "\ud83d\udc51 S+ TIER",
                "tierColor": "#ff4655",
                "tierRank": 1,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_efe3081ee3359a77b515575b5f7bc8c0.png?size=240&passthrough=true"
        },
        {
                "id": "frame-pinterest-03276e5db52e",
                "name": "Starlight Angelic Halo",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Angelic Gold",
                "color": "#fbbf24",
                "tier": "S+ Tier",
                "tierBadge": "\ud83d\udc51 S+ TIER",
                "tierColor": "#ff4655",
                "tierRank": 1,
                "imageSrc": "assets/pinterest_rings_cropped/ring_03276e5db52e99a23fad3621f94e11cd.png"
        },
        {
                "id": "frame-pinterest-4a987c0be793",
                "name": "Starlight Angelic Halo #22",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Angelic Gold",
                "color": "#fbbf24",
                "tier": "S+ Tier",
                "tierBadge": "\ud83d\udc51 S+ TIER",
                "tierColor": "#ff4655",
                "tierRank": 1,
                "imageSrc": "assets/pinterest_rings_cropped/ring_4a987c0be793b84b32d79d5acc3a1d50.png"
        },
        {
                "id": "frame-pinterest-aa948ebd507d",
                "name": "Starlight Angelic Halo #42",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Angelic Gold",
                "color": "#fbbf24",
                "tier": "S+ Tier",
                "tierBadge": "\ud83d\udc51 S+ TIER",
                "tierColor": "#ff4655",
                "tierRank": 1,
                "imageSrc": "assets/pinterest_rings_cropped/ring_aa948ebd507dbfc476fdf647b761dbce.png"
        },
        {
                "id": "frame-fishbones",
                "name": "FISHBONES!",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "S+ Tier",
                "tierBadge": "\ud83d\udc51 S+ TIER",
                "tierColor": "#ff4655",
                "tierRank": 1,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_84a67b33ef5b75e17f858a95648c973f.png?size=240&passthrough=true"
        },
        {
                "id": "frame-kitsune",
                "name": "Kitsune",
                "category": "Cosmic",
                "tag": "Cosmic & Galaxy",
                "color": "#c084fc",
                "tier": "S+ Tier",
                "tierBadge": "\ud83d\udc51 S+ TIER",
                "tierColor": "#ff4655",
                "tierRank": 1,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_be111e4303d634c55500202a61656e0b.png?size=240&passthrough=true"
        },
        {
                "id": "frame-glitch",
                "name": "Glitch",
                "category": "Game",
                "tag": "Esports & Gaming",
                "color": "#06b6d4",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_e90ebc0114e7bdc30353c8b11953ea41.png?size=240&passthrough=true"
        },
        {
                "id": "frame-spirit-embers",
                "name": "Spirit Embers",
                "category": "Dragon",
                "tag": "Mythic & Dragon",
                "color": "#ef4444",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_1005898c6acf56a9ac5010baf444f6fd.png?size=240&passthrough=true"
        },
        {
                "id": "frame-flaming-sword",
                "name": "Flaming Sword",
                "category": "Dragon",
                "tag": "Mythic & Dragon",
                "color": "#ef4444",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_0f5d6c4dd8ae74662ee9c40722a56cbd.png?size=240&passthrough=true"
        },
        {
                "id": "frame-omen-s-cowl",
                "name": "omen's cowl",
                "category": "Game",
                "tag": "Esports & Gaming",
                "color": "#06b6d4",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_c45abe8c7585fdb41b8d8d4d666f1588.png?size=240&passthrough=true"
        },
        {
                "id": "frame-yoru-bundle",
                "name": "Yoru Bundle",
                "category": "Game",
                "tag": "Esports & Gaming",
                "color": "#06b6d4",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_da532f804b47f1681006c2996eb07b2a.png?size=240&passthrough=true"
        },
        {
                "id": "frame-death-s-edge",
                "name": "Death's Edge",
                "category": "Game",
                "tag": "Esports & Gaming",
                "color": "#06b6d4",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_fe63036018fefb8abe3172383497e3bf.png?size=240&passthrough=true"
        },
        {
                "id": "frame-timekeeper-s-clock",
                "name": "Timekeeper's Clock",
                "category": "Royal",
                "tag": "24K Royal Gold",
                "color": "#fbbf24",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_f1c60c026aa89971e360ba88643d92c0.png?size=240&passthrough=true"
        },
        {
                "id": "frame-rumbling",
                "name": "Rumbling",
                "category": "Dragon",
                "tag": "Mythic & Dragon",
                "color": "#ef4444",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_df5442048d7d5b8b8906f3a9cd93f0ab.png?size=240&passthrough=true"
        },
        {
                "id": "frame-eldritch-ring",
                "name": "Eldritch Ring",
                "category": "Dragon",
                "tag": "Mythic & Dragon",
                "color": "#ef4444",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_ef6fe8b27123eacccebe51c92a61587c.png?size=240&passthrough=true"
        },
        {
                "id": "frame-pinterest-026d0b3869e1",
                "name": "Gothic Dark Rose Wreath",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Dark Gothic",
                "color": "#dc2626",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_026d0b3869e139d85cfe3accc16bf1a8.png"
        },
        {
                "id": "frame-pinterest-128524074e21",
                "name": "Blood Moon Crimson Ring",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Blood Moon",
                "color": "#991b1b",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_128524074e21967a1e761a20802d9ad5.png"
        },
        {
                "id": "frame-pinterest-130bbe3206b7",
                "name": "Solar Flare Corona Ring",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Solar Mythic",
                "color": "#f97316",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_130bbe3206b784937c0b2346efbc5a92.png"
        },
        {
                "id": "frame-pinterest-4a2d7a494c61",
                "name": "Gothic Dark Rose Wreath #21",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Dark Gothic",
                "color": "#dc2626",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_4a2d7a494c61bfdc1d45f4cab956fcb0.png"
        },
        {
                "id": "frame-pinterest-4db97f68e722",
                "name": "Blood Moon Crimson Ring #24",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Blood Moon",
                "color": "#991b1b",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_4db97f68e722e476a3c8373a951d6731.png"
        },
        {
                "id": "frame-pinterest-4e886ae895a0",
                "name": "Solar Flare Corona Ring #25",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Solar Mythic",
                "color": "#f97316",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_4e886ae895a05e08cbb62618b6538e44.png"
        },
        {
                "id": "frame-pinterest-934db449a5d4",
                "name": "Gothic Dark Rose Wreath #41",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Dark Gothic",
                "color": "#dc2626",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_934db449a5d4b50165091a20ead910d1.png"
        },
        {
                "id": "frame-pinterest-ae0fea1883ee",
                "name": "Blood Moon Crimson Ring #44",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Blood Moon",
                "color": "#991b1b",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_ae0fea1883ee603784b5d2e34cca111c.png"
        },
        {
                "id": "frame-pinterest-aec211b46cbe",
                "name": "Solar Flare Corona Ring #45",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Solar Mythic",
                "color": "#f97316",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_aec211b46cbed4acb004d02b96ad4abb.png"
        },
        {
                "id": "frame-digital-sunrise",
                "name": "Digital Sunrise",
                "category": "Cyber",
                "tag": "Cyberpunk & Tech",
                "color": "#00f3ff",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_cc83efd93ecd6e41857449c3c0ef9b22.png?size=240&passthrough=true"
        },
        {
                "id": "frame-rainy-mood",
                "name": "Rainy Mood",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_e8c11f139e55dac538cdaafb3caa2317.png?size=240&passthrough=true"
        },
        {
                "id": "frame-pinterest-13b10afa0af9",
                "name": "Ethereal Butterfly Wreath",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Butterfly",
                "color": "#c084fc",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_13b10afa0af9aa3cb6409931690dc9a8.png"
        },
        {
                "id": "frame-pinterest-155b08ee723b",
                "name": "Cosmic Nebula Astral Ring",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Cosmic",
                "color": "#e879f9",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_155b08ee723b68b9b85e3a29bcb6d78d.png"
        },
        {
                "id": "frame-pinterest-1ef8ba829e4c",
                "name": "Golden Baroque Filigree",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Royal Gold",
                "color": "#f59e0b",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_1ef8ba829e4cdf8fa2af4d9fb36fe363.png"
        },
        {
                "id": "frame-pinterest-508de34af8e8",
                "name": "Ethereal Butterfly Wreath #26",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Butterfly",
                "color": "#c084fc",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_508de34af8e8edb17b4530a7fa0efe88.png"
        },
        {
                "id": "frame-pinterest-577a21033951",
                "name": "Cosmic Nebula Astral Ring #27",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Cosmic",
                "color": "#e879f9",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_577a21033951a960b38ff946c3fc9d94.png"
        },
        {
                "id": "frame-pinterest-60e76f5f306b",
                "name": "Golden Baroque Filigree #29",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Royal Gold",
                "color": "#f59e0b",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_60e76f5f306b74e0f4d699ce80886377.png"
        },
        {
                "id": "frame-pinterest-b9056b0eef2b",
                "name": "Ethereal Butterfly Wreath #46",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Butterfly",
                "color": "#c084fc",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_b9056b0eef2babb6240a350c31e257b4.png"
        },
        {
                "id": "frame-pinterest-b9fd50b45c93",
                "name": "Cosmic Nebula Astral Ring #47",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Cosmic",
                "color": "#e879f9",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_b9fd50b45c930cdf195497958e7861f2.png"
        },
        {
                "id": "frame-pinterest-c6fdda3eb1ae",
                "name": "Golden Baroque Filigree #49",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Royal Gold",
                "color": "#f59e0b",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_c6fdda3eb1aec4b0ad2df7d16ddbf9d4.png"
        },
        {
                "id": "frame-pinterest-261f9664318d",
                "name": "Midnight Moon Crescent",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Lunar",
                "color": "#818cf8",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_261f9664318d92ea98398afb26f7c03c.png"
        },
        {
                "id": "frame-pinterest-2acbbc57ca6a",
                "name": "Glacial Crystal Shard Ring",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Ice Frost",
                "color": "#67e8f9",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_2acbbc57ca6a0d478043e2aaec7d8640.png"
        },
        {
                "id": "frame-pinterest-621b7d9c7cef",
                "name": "Midnight Moon Crescent #31",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Lunar",
                "color": "#818cf8",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_621b7d9c7cefe5a6a52787025c830c2d.png"
        },
        {
                "id": "frame-pinterest-6f48ab86c611",
                "name": "Glacial Crystal Shard Ring #33",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Ice Frost",
                "color": "#67e8f9",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_6f48ab86c611b09683e55bda94fda2dd.png"
        },
        {
                "id": "frame-pinterest-d53b014d86a6",
                "name": "Midnight Moon Crescent #51",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Lunar",
                "color": "#818cf8",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_d53b014d86a6b6761bf649a0ed813c2b.png"
        },
        {
                "id": "frame-pinterest-de6b261bd0f0",
                "name": "Glacial Crystal Shard Ring #53",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Ice Frost",
                "color": "#67e8f9",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_de6b261bd0f092070a561f6e76fb804f.png"
        },
        {
                "id": "frame-black-hole",
                "name": "Black Hole",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_6d16b27d9415cafe3b289053644337c4.png?size=240&passthrough=true"
        },
        {
                "id": "frame-magical-girl",
                "name": "Magical Girl",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_45f7f9975255971b197d34d77fb50ede.png?size=240&passthrough=true"
        },
        {
                "id": "frame-chromawave",
                "name": "Chromawave",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_49c479e15533fb4c02eb320c9c137433.png?size=240&passthrough=true"
        },
        {
                "id": "frame-koi-pond",
                "name": "Koi Pond",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_50b440810b1bbd89f6284f36d40ad0af.png?size=240&passthrough=true"
        },
        {
                "id": "frame-faces-of-the-moon",
                "name": "Faces of the Moon",
                "category": "Cosmic",
                "tag": "Cosmic & Galaxy",
                "color": "#c084fc",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_50cfb73a4c52235363491855d3c3c3bc.png?size=240&passthrough=true"
        },
        {
                "id": "frame-crystal-elk",
                "name": "Crystal Elk",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_98c7600d304b86ca3b18272e1da05559.png?size=240&passthrough=true"
        },
        {
                "id": "frame-power-by-shimmer",
                "name": "Power by shimmer",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_609fb5c17a4d5ff2e2bec1a1931a9caa.png?size=240&passthrough=true"
        },
        {
                "id": "frame-blade-storm",
                "name": "Blade storm",
                "category": "Dragon",
                "tag": "Mythic & Dragon",
                "color": "#ef4444",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_904b1989077c91fca1168d39bfcaa0a4.png?size=240&passthrough=true"
        },
        {
                "id": "frame-midnight-sorceress",
                "name": "Midnight Sorceress",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_4430a4ee89b7fba456e765db21f38485.png?size=240&passthrough=true"
        },
        {
                "id": "frame-kabuto",
                "name": "Kabuto",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_084353360ae4f9b5b3b5f186e5525de0.png?size=240&passthrough=true"
        },
        {
                "id": "frame-aurora",
                "name": "Aurora",
                "category": "Cosmic",
                "tag": "Cosmic & Galaxy",
                "color": "#c084fc",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_386445551be850bb16b73a225d0d0602.png?size=240&passthrough=true"
        },
        {
                "id": "frame-dusk-and-dawn",
                "name": "Dusk and Dawn",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_a44e9335ea869639fdf812f3642a56a6.png?size=240&passthrough=true"
        },
        {
                "id": "frame-reyna-s-leer",
                "name": "Reyna's leer",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_a87e3efa4de2956331831681231ce63b.png?size=240&passthrough=true"
        },
        {
                "id": "frame-baby-displacer-beast",
                "name": "Baby Displacer Beast",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_a842a9cf76fdaf91a6354937b31ecdef.png?size=240&passthrough=true"
        },
        {
                "id": "frame-oni-mask",
                "name": "oni mask",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_a21393f8a2cb8eafbdfb5364fb1cbbae.png?size=240&passthrough=true"
        },
        {
                "id": "frame-the-anomaly",
                "name": "The Anomaly",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_af5ee420e5f860ff2cdbb5fa4633f2cf.png?size=240&passthrough=true"
        },
        {
                "id": "frame-uwu-xp",
                "name": "UwU XP",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_e257ca83b5b164968fd036f69dbb2ad9.png?size=240&passthrough=true"
        },
        {
                "id": "frame-aracanist-bundle",
                "name": "Aracanist Bundle",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_ef8d97374ffdbf140df1164be6c69e46.png?size=240&passthrough=true"
        },
        {
                "id": "frame-pinterest-3667cdfe58a7",
                "name": "Vintage Filigree Gold Wreath",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Vintage",
                "color": "#fbbf24",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_3667cdfe58a723c84d7bca491ec2f368.png"
        },
        {
                "id": "frame-pinterest-838626ad2ca9",
                "name": "Vintage Filigree Gold Wreath #37",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Vintage",
                "color": "#fbbf24",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_838626ad2ca910a0fff363950c6dfc9b.png"
        },
        {
                "id": "frame-pinterest-fa79d13045ad",
                "name": "Vintage Filigree Gold Wreath #57",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Vintage",
                "color": "#fbbf24",
                "tier": "S Tier",
                "tierBadge": "\u2b50 S TIER",
                "tierColor": "#fbbf24",
                "tierRank": 2,
                "imageSrc": "assets/pinterest_rings_cropped/ring_fa79d13045adee693973d0fb9942f713.png"
        },
        {
                "id": "frame-shuriken-s-mark",
                "name": "shuriken's mark",
                "category": "Game",
                "tag": "Esports & Gaming",
                "color": "#06b6d4",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_c32ce5680d4be96e059790ad493aa0fe.png?size=240&passthrough=true"
        },
        {
                "id": "frame-e-d-hacker",
                "name": "E.D Hacker",
                "category": "Game",
                "tag": "Esports & Gaming",
                "color": "#06b6d4",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_cdca4a092a03b16b94e50289fe3f7bd1.png?size=160&passthrough=true"
        },
        {
                "id": "frame-disxcore-headset",
                "name": "DISXCORE Headset",
                "category": "Game",
                "tag": "Esports & Gaming",
                "color": "#06b6d4",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_d3da36040163ee0f9176dfe7ced45cdc.png?size=240&passthrough=true"
        },
        {
                "id": "frame-golden-hex",
                "name": "Golden Hex",
                "category": "Royal",
                "tag": "24K Royal Gold",
                "color": "#fbbf24",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_ccee9031d66bc0f2d7ed0c6178d01784.png?size=240&passthrough=true"
        },
        {
                "id": "frame-gold-laurel-wreath",
                "name": "Gold Laurel Wreath",
                "category": "Royal",
                "tag": "24K Royal Gold",
                "color": "#fbbf24",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_fcb0de14da228879b455f1f1d3919749.png?size=240&passthrough=true"
        },
        {
                "id": "frame-aradiating-energy",
                "name": "ARadiating Energy",
                "category": "Dragon",
                "tag": "Mythic & Dragon",
                "color": "#ef4444",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_c7e1751e8122f1b475cb3006966fb28c.png?size=240&passthrough=true"
        },
        {
                "id": "frame-ki-energy",
                "name": "Ki Energy",
                "category": "Dragon",
                "tag": "Mythic & Dragon",
                "color": "#ef4444",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_f3af281c65cf0cf590e9e1f59e9c6cf6.png?size=240&passthrough=true"
        },
        {
                "id": "frame-port-of-soul",
                "name": "Port of Soul",
                "category": "Dragon",
                "tag": "Mythic & Dragon",
                "color": "#ef4444",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_f4fcdab859b2eab1874fbe7182d5aa26.png?size=240&passthrough=true"
        },
        {
                "id": "frame-pinterest-118f1fe72c82",
                "name": "Cyber Neon Crescent",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Cyberpunk",
                "color": "#00f3ff",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_118f1fe72c82c83a7bb19be3468b241c.png"
        },
        {
                "id": "frame-pinterest-4c2a66cf4f3c",
                "name": "Cyber Neon Crescent #23",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Cyberpunk",
                "color": "#00f3ff",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_4c2a66cf4f3c878c3e74e83b0eea8009.png"
        },
        {
                "id": "frame-pinterest-aae7a6a3e04c",
                "name": "Cyber Neon Crescent #43",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Cyberpunk",
                "color": "#00f3ff",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_aae7a6a3e04c89da5fc7c5e1086edfa2.png"
        },
        {
                "id": "frame-sakura-scholar",
                "name": "Sakura scholar",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_e0a2df84cf7eb8e098a13e37ec9027c1.png?size=240&passthrough=true"
        },
        {
                "id": "frame-cat-ears",
                "name": "cat Ears",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_c3cffc19e9784f7d0b005eecdf1b566e.png?size=240&passthrough=true"
        },
        {
                "id": "frame-steampunk-cat-ears",
                "name": "Steampunk Cat Ears",
                "category": "Cyber",
                "tag": "Cyberpunk & Tech",
                "color": "#00f3ff",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_1acbe609daec21fa5b866df9e5a42cb7.png?size=240&passthrough=true"
        },
        {
                "id": "frame-lotus-flower",
                "name": "Lotus Flower",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_2e55d644e11acb6253dfa422eff16dfd.png?size=240&passthrough=true"
        },
        {
                "id": "frame-heartbloom",
                "name": "Heartbloom",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_3e1fc3c7ee2e34e8176f4737427e8f4f.png?size=240&passthrough=true"
        },
        {
                "id": "frame-spooky-cat-ears",
                "name": "spooky cat Ears",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_33656b7ed12cde00c1826b654cf65590.png?size=240&passthrough=true"
        },
        {
                "id": "frame-wizard-hat",
                "name": "Wizard Hat",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_c25b962e5cabb9a656f02c50095d6496.png?size=240&passthrough=true"
        },
        {
                "id": "frame-flux-alchemy",
                "name": "Flux Alchemy",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_d8d93c7a53c0dd07a4074b745210434d.png?size=240&passthrough=true"
        },
        {
                "id": "frame-starry-eyed",
                "name": "Starry Eyed",
                "category": "Royal",
                "tag": "24K Royal Gold",
                "color": "#fbbf24",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_d72066b8cecbadd9fc951913ebcc384f.png?size=240&passthrough=true"
        },
        {
                "id": "frame-juri",
                "name": "Juri",
                "category": "Game",
                "tag": "Esports & Gaming",
                "color": "#06b6d4",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_dcfe10bac4a782ffb5eefef7a8003115.png?size=240&passthrough=true"
        },
        {
                "id": "frame-bunny-zzzs",
                "name": "Bunny Zzzs",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_f438bb9b2f25ac55058fc169ecc8096e.png?size=240&passthrough=true"
        },
        {
                "id": "frame-cat-ear-headset",
                "name": "Cat Ear Headset",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_fa39ba4d9eff38d2eeb47ebcb623e4ca.png?size=240&passthrough=true"
        },
        {
                "id": "frame-fairy-pixie-bundle",
                "name": "Fairy & Pixie Bundle",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_fe3c76cac2adf426832a7e495e8329d3.png?size=160&passthrough=true"
        },
        {
                "id": "frame-futuristic-ui",
                "name": "Futuristic UI",
                "category": "Game",
                "tag": "Esports & Gaming",
                "color": "#06b6d4",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_fed43ab12698df65902ba06727e20c0e.png?size=240&passthrough=true"
        },
        {
                "id": "frame-pinterest-18c2d5c084bb",
                "name": "Neon Purple Matrix Hex",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Cyber Matrix",
                "color": "#a855f7",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_18c2d5c084bb5d82d646c88f64159771.png"
        },
        {
                "id": "frame-pinterest-5a583d2c8be4",
                "name": "Neon Purple Matrix Hex #28",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Cyber Matrix",
                "color": "#a855f7",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_5a583d2c8be40dba8068b671bdfdb35e.png"
        },
        {
                "id": "frame-pinterest-c01a0c8332ec",
                "name": "Neon Purple Matrix Hex #48",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Cyber Matrix",
                "color": "#a855f7",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_c01a0c8332ecf615fc293a328f155b65.png"
        },
        {
                "id": "frame-snowglobe",
                "name": "Snowglobe",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_2ca5fb1ecf0dac410b38d76cb4aae7f9.png?size=240&passthrough=true"
        },
        {
                "id": "frame-owlbear-cub",
                "name": "Owlbear Cub",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_3c5743cedcb72131c58278278a97c143.png?size=240&passthrough=true"
        },
        {
                "id": "frame-water",
                "name": "Water",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_250640ab00a8837a1d56f35879138177.png?size=240&passthrough=true"
        },
        {
                "id": "frame-oasis",
                "name": "Oasis",
                "category": "Cosmic",
                "tag": "Cosmic & Galaxy",
                "color": "#c084fc",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_f740031cc97d1b7eb73c0d0ac1dd09f3.png?size=240&passthrough=true"
        },
        {
                "id": "frame-pinterest-239a5c41d49c",
                "name": "Cherry Blossom Petal Ring",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Floral Sakura",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_239a5c41d49c534a6b5073b597758b05.png"
        },
        {
                "id": "frame-pinterest-2863ea6e3724",
                "name": "Emerald Spirit Forest Ring",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Nature",
                "color": "#10b981",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_2863ea6e3724a8f2cd11e152042cc4f2.png"
        },
        {
                "id": "frame-pinterest-2babb5d4dc1c",
                "name": "Kawaii Pastel Cloud Halo",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Pastel",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_2babb5d4dc1caa9475adf9b53ef25ddc.png"
        },
        {
                "id": "frame-pinterest-2e332f5917be",
                "name": "Lavender Fairy Blossom",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Fairy",
                "color": "#c084fc",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_2e332f5917be63cc725de10bafc6f567.png"
        },
        {
                "id": "frame-pinterest-61fb25407346",
                "name": "Cherry Blossom Petal Ring #30",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Floral Sakura",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_61fb25407346ccbd9b7b13f2f1a5fa8c.png"
        },
        {
                "id": "frame-pinterest-64b6501be684",
                "name": "Emerald Spirit Forest Ring #32",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Nature",
                "color": "#10b981",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_64b6501be6841ad446c1f4409410a976.png"
        },
        {
                "id": "frame-pinterest-755e2e4e499a",
                "name": "Kawaii Pastel Cloud Halo #34",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Pastel",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_755e2e4e499a7aa3d785e9364bff7f04.png"
        },
        {
                "id": "frame-pinterest-7676ee9b1960",
                "name": "Lavender Fairy Blossom #35",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Fairy",
                "color": "#c084fc",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_7676ee9b196027a6dbc185dadf16a48a.png"
        },
        {
                "id": "frame-pinterest-d16912a05b8b",
                "name": "Cherry Blossom Petal Ring #50",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Floral Sakura",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_d16912a05b8bbf2216547f90f89c1272.png"
        },
        {
                "id": "frame-pinterest-d9e872af0afd",
                "name": "Emerald Spirit Forest Ring #52",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Nature",
                "color": "#10b981",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_d9e872af0afd21ea0c15d8a20578678d.png"
        },
        {
                "id": "frame-pinterest-e43553b49d3b",
                "name": "Kawaii Pastel Cloud Halo #54",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Pastel",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_e43553b49d3b013f983a582051a63ed1.png"
        },
        {
                "id": "frame-pinterest-f0aa40376729",
                "name": "Lavender Fairy Blossom #55",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Fairy",
                "color": "#c084fc",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_f0aa40376729cc88dd8fd9e39b7911cb.png"
        },
        {
                "id": "frame-firecrackers",
                "name": "Firecrackers",
                "category": "Dragon",
                "tag": "Mythic & Dragon",
                "color": "#ef4444",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_0f4f1b40921ce680b60007e94427d1f2.png?size=160&passthrough=true"
        },
        {
                "id": "frame-straw-hat",
                "name": "Straw Hat",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_3d1e6078b2e4c8865e0ad0f429d651b1.png?size=240&passthrough=true"
        },
        {
                "id": "frame-bubble-tea",
                "name": "Bubble Tea",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_5b1319abfc9f928479b68a73635f591d.png?size=240&passthrough=true"
        },
        {
                "id": "frame-shy",
                "name": "Shy",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_6b793a5f7e4e15eea6b10a4fde448511.png?size=240&passthrough=true"
        },
        {
                "id": "frame-ufo",
                "name": "UFO",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_6fdbddb6229453eac3bbb212edf5cd1c.png?size=240&passthrough=true"
        },
        {
                "id": "frame-aespa-fanlight",
                "name": "aespa Fanlight",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_007d64a922ff5773fb9464945de93c8e.png?size=240&passthrough=true"
        },
        {
                "id": "frame-sakura-warrior",
                "name": "Sakura Warrior",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_7cf09c7e78d6eb35ae354acc1d5cc676.png?size=240&passthrough=true"
        },
        {
                "id": "frame-fox-hat",
                "name": "Fox Hat",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_7d305bca6cf371df98c059f9d2ef05e4.png?size=240&passthrough=true"
        },
        {
                "id": "frame-hex-lights",
                "name": "Hex Lights",
                "category": "Royal",
                "tag": "24K Royal Gold",
                "color": "#fbbf24",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_09bb4197c743ea31b7eb052eddd3e892.png?size=240&passthrough=true"
        },
        {
                "id": "frame-solar-orbit",
                "name": "Solar Orbit",
                "category": "Cosmic",
                "tag": "Cosmic & Galaxy",
                "color": "#c084fc",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_9a6bf0ab30a6719d6eb09fa4996984ca.png?size=240&passthrough=true"
        },
        {
                "id": "frame-the-monster-you-created",
                "name": "The Monster You Created",
                "category": "Dragon",
                "tag": "Mythic & Dragon",
                "color": "#ef4444",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_9bc421cef4bdcfffeb2344b44ad91b44.png?size=240&passthrough=true"
        },
        {
                "id": "frame-fan-flourish",
                "name": "Fan Flourish",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_9d2ff9685be0c668ef6990b0035fac17.png?size=240&passthrough=true"
        },
        {
                "id": "frame-mooncaps-blue",
                "name": "Mooncaps (Blue)",
                "category": "Cosmic",
                "tag": "Cosmic & Galaxy",
                "color": "#c084fc",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_25f7407a6a0c5de43736a1f24c3b7979.png?size=160&passthrough=true"
        },
        {
                "id": "frame-honeyblossom",
                "name": "Honeyblossom",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_27bbf0b53b1054cf61e9a4c0e8d4027f.png?size=240&passthrough=true"
        },
        {
                "id": "frame-heartstrings-blue",
                "name": "Heartstrings (Blue)",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_42cc3fe7133523096466102e7a222003.png?size=160&passthrough=true"
        },
        {
                "id": "frame-lofi-girl-outfit",
                "name": "Lofi Girl Outfit",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_60cb281fac6d8f558efaf6dd9fe4dbe4.png?size=240&passthrough=true"
        },
        {
                "id": "frame-viper-poison-cloud",
                "name": "Viper Poison Cloud",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_62cd9d7c0031a7c1eb5ad5cc96992189.png?size=240&passthrough=true"
        },
        {
                "id": "frame-heartstrings-red",
                "name": "Heartstrings (Red)",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_63a69109db554a66764cbe61c6e556ef.png?size=240&passthrough=true"
        },
        {
                "id": "frame-lunar-lanterns",
                "name": "Lunar Lanterns",
                "category": "Cosmic",
                "tag": "Cosmic & Galaxy",
                "color": "#c084fc",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_63b29ec5b1ea6bb01c2251049838d822.png?size=240&passthrough=true"
        },
        {
                "id": "frame-m-bison",
                "name": "M. Bison",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_66f69effef43b4f7c4f5d0739079a947.png?size=160&passthrough=true"
        },
        {
                "id": "frame-ryu",
                "name": "Ryu",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_68cb6c21d6222cd9285c08068f39873d.png?size=240&passthrough=true"
        },
        {
                "id": "frame-magic-portal-purple",
                "name": "Magic Portal (Purple)",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_72d1fd7c47cc7a98c8f64d175773344b.png?size=240&passthrough=true"
        },
        {
                "id": "frame-cozy-cat",
                "name": "Cozy Cat",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_77b7b6a740a9451e1ef39c0252154ef8.png?size=240&passthrough=true"
        },
        {
                "id": "frame-cannon-fire",
                "name": "Cannon Fire",
                "category": "Dragon",
                "tag": "Mythic & Dragon",
                "color": "#ef4444",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_91a33236cf2728310a3a29bbdc8e0d29.png?size=240&passthrough=true"
        },
        {
                "id": "frame-playful-lofi-cat",
                "name": "Playful Lofi Cat",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_96f65d0aacc4a94b50ef7fb656d5826d.png?size=240&passthrough=true"
        },
        {
                "id": "frame-magic-portal-blue",
                "name": "Magic Portal (Blue)",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_98cf94e029ac79c5b377413d1a2bd82f.png?size=160&passthrough=true"
        },
        {
                "id": "frame-implant",
                "name": "Implant",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_172fa9da0af8698e37f5e5de76637439.png?size=240&passthrough=true"
        },
        {
                "id": "frame-lightning",
                "name": "Lightning",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_365eed4178528fe8293c4212e8e2d5cb.png?size=240&passthrough=true"
        },
        {
                "id": "frame-mech-flora",
                "name": "Mech flora",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_459cf2afde41f01559a4a4204ab81767.png?size=240&passthrough=true"
        },
        {
                "id": "frame-mallow-jump",
                "name": "Mallow Jump",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_492f6b54b761c0a14d9dbc9c98aaa0f5.png?size=240&passthrough=true"
        },
        {
                "id": "frame-pirate-captain",
                "name": "Pirate captain",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_798a5bcbb11067e4d9ab339e51d2a16c.png?size=240&passthrough=true"
        },
        {
                "id": "frame-constellations",
                "name": "Constellations",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_8552f9857793aed0cf816f370e2df3be.png?size=240&passthrough=true"
        },
        {
                "id": "frame-cat-onesie",
                "name": "cat onesie",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_9661cf3296ac236d8815e3f5b809a467.png?size=240&passthrough=true"
        },
        {
                "id": "frame-strawberry-vine",
                "name": "Strawberry Vine",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_9867b1ba56601e745cfe741e6b00b835.png?size=240&passthrough=true"
        },
        {
                "id": "frame-dark-hood",
                "name": "Dark Hood",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_41445f736db3525135b6b9e1122f2254.png?size=240&passthrough=true"
        },
        {
                "id": "frame-gelatinous-cube",
                "name": "Gelatinous Cube",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_66604bb5c9351541f30c20a4e78c239c.png?size=240&passthrough=true"
        },
        {
                "id": "frame-neon-nibbles",
                "name": "Neon Nibbles",
                "category": "Cyber",
                "tag": "Cyberpunk & Tech",
                "color": "#00f3ff",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_126219d37fa9422dab6a075064453750.png?size=240&passthrough=true"
        },
        {
                "id": "frame-ruby-hearts",
                "name": "Ruby hearts",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_a1c0581971d4a296908829289fea2c47.png?size=240&passthrough=true"
        },
        {
                "id": "frame-polar-bear-hat",
                "name": "Polar Bear hat",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_a7e6467b5332ab7a2b725aa225e6c752.png?size=240&passthrough=true"
        },
        {
                "id": "frame-fire",
                "name": "Fire",
                "category": "Dragon",
                "tag": "Mythic & Dragon",
                "color": "#ef4444",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_a065206df7b011a5510e4e5bca7d49be.png?size=240&passthrough=true"
        },
        {
                "id": "frame-cypher-neural-theft",
                "name": "cypher Neural Theft",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_b1efe77f379c6c9c6e47e6b6299d5a7d.png?size=240&passthrough=true"
        },
        {
                "id": "frame-devil",
                "name": "Devil",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_b4dcf63b6af2e20cba91af61c0e3a8a7.png?size=240&passthrough=true"
        },
        {
                "id": "frame-mooncaps",
                "name": "Mooncaps",
                "category": "Cosmic",
                "tag": "Cosmic & Galaxy",
                "color": "#c084fc",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_b13180be7866281f6fa588a49dd7feb0.png?size=240&passthrough=true"
        },
        {
                "id": "frame-cozy-headphones",
                "name": "cozy Headphones",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_bb71042ccd2ca277a69f086a4f3354d0.png?size=240&passthrough=true"
        },
        {
                "id": "frame-brass-beats",
                "name": "Brass beats",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_bfaeda83edb41e78250eedc71bed31fc.png?size=240&passthrough=true"
        },
        {
                "id": "frame-glowing-runes",
                "name": "Glowing Runes",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_d650e22f6c4bab4fc0969e9d35edbcb0.png?size=240&passthrough=true"
        },
        {
                "id": "frame-cozy-post-it",
                "name": "Cozy POST-IT",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_e671277ab6d18c0de00871347eed94a7.png?size=240&passthrough=true"
        },
        {
                "id": "frame-azure-dice-roll-bundle",
                "name": "Azure Dice Roll Bundle",
                "category": "Game",
                "tag": "Esports & Gaming",
                "color": "#06b6d4",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_f8ffeba6f389d1475c8794ca88b59785.png?size=160&passthrough=true"
        },
        {
                "id": "frame-earht",
                "name": "Earht",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_fa014594d4b2b4249e1098c0adc85b47.png?size=240&passthrough=true"
        },
        {
                "id": "frame-pinterest-36b527cde453",
                "name": "Simple Minimalist Arc Ring",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Minimalist",
                "color": "#94a3b8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_36b527cde453e8e80089c1838c0f5a6e.png"
        },
        {
                "id": "frame-pinterest-3bdee84ef9d2",
                "name": "Soft Accent Ribbon Ring",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Ribbon",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_3bdee84ef9d221641b87e4a8003ca15c.png"
        },
        {
                "id": "frame-pinterest-8aa4f8d0e8ab",
                "name": "Simple Minimalist Arc Ring #38",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Minimalist",
                "color": "#94a3b8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_8aa4f8d0e8ab93a380a0a099d4171ff0.png"
        },
        {
                "id": "frame-pinterest-8f71d927613d",
                "name": "Soft Accent Ribbon Ring #39",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Ribbon",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_8f71d927613d7cce8fc735f507d8f5da.png"
        },
        {
                "id": "frame-pinterest-pin_755e2e",
                "name": "Simple Minimalist Arc Ring #58",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Minimalist",
                "color": "#94a3b8",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_pin_755e2e.png"
        },
        {
                "id": "frame-pinterest-pin_7a2360",
                "name": "Soft Accent Ribbon Ring #59",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Ribbon",
                "color": "#f472b6",
                "tier": "A Tier",
                "tierBadge": "\ud83e\udd47 A TIER",
                "tierColor": "#c084fc",
                "tierRank": 3,
                "imageSrc": "assets/pinterest_rings_cropped/ring_pin_7a2360.png"
        },
        {
                "id": "frame-soul-leaving-body",
                "name": "soul Leaving Body",
                "category": "Dragon",
                "tag": "Mythic & Dragon",
                "color": "#ef4444",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_c3c09bd122898be35093d0d59850f627.png?size=240&passthrough=true"
        },
        {
                "id": "frame-magical-potion",
                "name": "Magical Potion",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_1dbc603c181999b9815cb426dfec71a6.png?size=240&passthrough=true"
        },
        {
                "id": "frame-ramenbowl",
                "name": "RamenBowl",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_001e956faa73bd0410c455234c62818f.png?size=240&passthrough=true"
        },
        {
                "id": "frame-flame-chompers",
                "name": "Flame Chompers",
                "category": "Dragon",
                "tag": "Mythic & Dragon",
                "color": "#ef4444",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_8396e9830e3e288cd3aaa6daf18b605a.png?size=240&passthrough=true"
        },
        {
                "id": "frame-dragon-s-smile",
                "name": "Dragon's smile",
                "category": "Dragon",
                "tag": "Mythic & Dragon",
                "color": "#ef4444",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_445566ed965b2c1632a5b45c92f32d11.png?size=240&passthrough=true"
        },
        {
                "id": "frame-autumn-crown",
                "name": "Autumn crown",
                "category": "Royal",
                "tag": "24K Royal Gold",
                "color": "#fbbf24",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_c509c4760e5e1a50fa341d68f3c1901b.png?size=240&passthrough=true"
        },
        {
                "id": "frame-magical-wand",
                "name": "Magical Wand",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_d3a9c3a1c89ccb0e1ab8724a5c965f48.png?size=240&passthrough=true"
        },
        {
                "id": "frame-snake-s-hug",
                "name": "Snake's Hug",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_d859cee893cffd5dd0fa17a6caea44e0.png?size=240&passthrough=true"
        },
        {
                "id": "frame-wizard-s-staff",
                "name": "Wizard's Staff",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_db9baf0ba7cf449d2b027c06309dbe8d.png?size=240&passthrough=true"
        },
        {
                "id": "frame-aim-for-love",
                "name": "Aim For Love",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_e60cc4d7f4d8a6e79dd8cc67d2b13d6c.png?size=240&passthrough=true"
        },
        {
                "id": "frame-clyde-invaders",
                "name": "Clyde invaders",
                "category": "Game",
                "tag": "Esports & Gaming",
                "color": "#06b6d4",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_e72e44eeea89e92dc02c9bec8b02d158.png?size=240&passthrough=true"
        },
        {
                "id": "frame-a-sphere-of-gusting-wind-swirls-around-the-avatar",
                "name": "A sphere of gusting wind swirls around the avatar.",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_f081c6b2c85c5ebe5df42f1c24d45bb5.png?size=240&passthrough=true"
        },
        {
                "id": "frame-ken",
                "name": "Ken",
                "category": "Game",
                "tag": "Esports & Gaming",
                "color": "#06b6d4",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_f524554b7f42a214d15c226c344a5357.png?size=240&passthrough=true"
        },
        {
                "id": "frame-hugh-the-rainbow",
                "name": "Hugh the Rainbow",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_0c0eeb351ae2cf48c6e1eee2cae49d40.png?size=240&passthrough=true"
        },
        {
                "id": "frame-lucky-envelopes",
                "name": "Lucky Envelopes",
                "category": "Royal",
                "tag": "24K Royal Gold",
                "color": "#fbbf24",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_1b1df0ae8c2d34afd85da5c22a0d761a.png?size=240&passthrough=true"
        },
        {
                "id": "frame-candlelight",
                "name": "Candlelight",
                "category": "Dragon",
                "tag": "Mythic & Dragon",
                "color": "#ef4444",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_3f29e6edfe1cff43736f644cf1d01278.png?size=240&passthrough=true"
        },
        {
                "id": "frame-treasure-and-key",
                "name": "Treasure and Key",
                "category": "Royal",
                "tag": "24K Royal Gold",
                "color": "#fbbf24",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_4c9f2ec29c05755456dbce45d8190ed4.png?size=240&passthrough=true"
        },
        {
                "id": "frame-string-lights-ember",
                "name": "String Lights (Ember)",
                "category": "Dragon",
                "tag": "Mythic & Dragon",
                "color": "#ef4444",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_63d17f42ee46a843d99a58655910bc6a.png?size=160&passthrough=true"
        },
        {
                "id": "frame-a-hint-of-clove",
                "name": "A hint of clove",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_98555e40cc6802bd3a4fed906af1d992.png?size=240&passthrough=true"
        },
        {
                "id": "frame-autumn-s-arbor",
                "name": "Autumn's Arbor",
                "category": "Cosmic",
                "tag": "Cosmic & Galaxy",
                "color": "#c084fc",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_fead934c894e95e070d8a0301f9f0b27.png?size=240&passthrough=true"
        },
        {
                "id": "frame-pinterest-319467bfabe6",
                "name": "Anime Sparkle Dream Ring",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Sparkle",
                "color": "#f472b6",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "assets/pinterest_rings_cropped/ring_319467bfabe62ad18d129f2508bb7b25.png"
        },
        {
                "id": "frame-pinterest-7a23607a12c8",
                "name": "Anime Sparkle Dream Ring #36",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Sparkle",
                "color": "#f472b6",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "assets/pinterest_rings_cropped/ring_7a23607a12c864ce07f8c1c0d0a19f41.png"
        },
        {
                "id": "frame-pinterest-f65c8d001c5f",
                "name": "Anime Sparkle Dream Ring #56",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Sparkle",
                "color": "#f472b6",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "assets/pinterest_rings_cropped/ring_f65c8d001c5f88c30a9c87dbaad7decb.png"
        },
        {
                "id": "frame-next-turn-button",
                "name": "Next Turn Button",
                "category": "Game",
                "tag": "Esports & Gaming",
                "color": "#06b6d4",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_2b95e7a4951a1a092e7870bf1d456262.png?size=240&passthrough=true"
        },
        {
                "id": "frame-angry",
                "name": "Angry",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_3c97a2d37f433a7913a1c7b7a735d000.png?size=240&passthrough=true"
        },
        {
                "id": "frame-in-tears",
                "name": "in Tears",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_4cc97277177b166fd7d4af3bdb370815.png?size=240&passthrough=true"
        },
        {
                "id": "frame-butterflies",
                "name": "Butterflies",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_4cd9ae5a8d103c219eacd3674d7730cd.png?size=240&passthrough=true"
        },
        {
                "id": "frame-zombie-food",
                "name": "Zombie Food",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_4f2b75e5adff09709702613ea0e2cb70.png?size=240&passthrough=true"
        },
        {
                "id": "frame-witch-hat-plum",
                "name": "Witch Hat (Plum)",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_5e8abacc7a7454d6b08b5cc84cac1d80.png?size=240&passthrough=true"
        },
        {
                "id": "frame-mirage",
                "name": "Mirage",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_6d99f670de3fcee669660fe262e896ea.png?size=240&passthrough=true"
        },
        {
                "id": "frame-lovestruck",
                "name": "Lovestruck",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_7f44d538ec830f479605f7bf8720afda.png?size=240&passthrough=true"
        },
        {
                "id": "frame-group-hug",
                "name": "Group Hug",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_8ad98d25ee4e4512704f759476eeb294.png?size=240&passthrough=true"
        },
        {
                "id": "frame-hex-tiles",
                "name": "Hex Tiles",
                "category": "Royal",
                "tag": "24K Royal Gold",
                "color": "#fbbf24",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_8dddba8c2a9704a943bb7020a3d0a418.png?size=240&passthrough=true"
        },
        {
                "id": "frame-crystal-ball-blue",
                "name": "Crystal Ball (Blue)",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_8ee8ae54bddfcb17d7d5c5f9bce41c0d.png?size=240&passthrough=true"
        },
        {
                "id": "frame-in-love",
                "name": "In Love",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_8ffa2ba9bff18e96b76c2e66fd0d7fa3.png?size=240&passthrough=true"
        },
        {
                "id": "frame-frag-out",
                "name": "FRAG OUT",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_09de63526a45be1ddac70e84718ee04a.png?size=240&passthrough=true"
        },
        {
                "id": "frame-good-ol-pepper",
                "name": "Good Ol'Pepper",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_9cc1c1426ea5478aac7be6cdefdbc568.png?size=240&passthrough=true"
        },
        {
                "id": "frame-skull-medallion",
                "name": "Skull Medallion",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_9d67a1cbf81fe7197c871e94f619b04b.png?size=240&passthrough=true"
        },
        {
                "id": "frame-tarrain-tiles",
                "name": "Tarrain Tiles",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_9d95e36bc282523fddc63d31a8d01091.png?size=240&passthrough=true"
        },
        {
                "id": "frame-red-lantern",
                "name": "Red Lantern",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_9e16d86b2887eb2a3bed36a5b8876935.png?size=240&passthrough=true"
        },
        {
                "id": "frame-string-lights-dusk",
                "name": "String Lights (Dusk)",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_28e531da18a80b8287837332154c5f58.png?size=160&passthrough=true"
        },
        {
                "id": "frame-defensive-shield",
                "name": "Defensive Shield",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_29a0533cb3de61aa8179810188f3830d.png?size=240&passthrough=true"
        },
        {
                "id": "frame-unicorn",
                "name": "Unicorn",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_47c0f4b4a837894998d5a316acf74f87.png?size=240&passthrough=true"
        },
        {
                "id": "frame-rocket-puncher",
                "name": "Rocket Puncher",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_49ed38f73003e2e182f77190af0a0a56.png?size=240&passthrough=true"
        },
        {
                "id": "frame-slither-n-snack",
                "name": "Slither'n Snack",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_49ffdb1883d8c644a8eb68711ee58be9.png?size=240&passthrough=true"
        },
        {
                "id": "frame-scallywag",
                "name": "Scallywag",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_78f326d95c0193c317470e3e81db81e7.png?size=240&passthrough=true"
        },
        {
                "id": "frame-string-lights",
                "name": "String Lights",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_88f42fb7360d8224a670a50c3496f315.png?size=240&passthrough=true"
        },
        {
                "id": "frame-valorant-champions-2024",
                "name": "VALORANT Champions 2024",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_90e0dce3cc48c4a9607b6d41209c737e.png?size=240&passthrough=true"
        },
        {
                "id": "frame-cottage-home",
                "name": "Cottage Home",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_210b82b98876083ce393ecd92eb07260.png?size=240&passthrough=true"
        },
        {
                "id": "frame-bloomling",
                "name": "Bloomling",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_306a56249fe3c3d2bc7a30041cb63e0e.png?size=240&passthrough=true"
        },
        {
                "id": "frame-lava-lamp-bundle",
                "name": "Lava Lamp Bundle",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_462b0bddc07dd495765fe12abe8b077f.png?size=240&passthrough=true"
        },
        {
                "id": "frame-dancing-fairies",
                "name": "Dancing fairies",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_535aa3354b1a7395c271bb2f53be4275.png?size=240&passthrough=true"
        },
        {
                "id": "frame-air",
                "name": "Air",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_554b7c34f7b6c709f19535aacb128e7b.png?size=240&passthrough=true"
        },
        {
                "id": "frame-rose-bearer",
                "name": "Rose Bearer",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_555ad9b90a13534180b9274d013e3651.png?size=240&passthrough=true"
        },
        {
                "id": "frame-head-in-the-clouds",
                "name": "Head in the clouds",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_670b722e56740d11d1e6fe55b8094013.png?size=240&passthrough=true"
        },
        {
                "id": "frame-fall-leaves",
                "name": "fall leaves",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_720a2045510ec16f9878237d2ff9873f.png?size=160&passthrough=true"
        },
        {
                "id": "frame-guile",
                "name": "Guile",
                "category": "Game",
                "tag": "Esports & Gaming",
                "color": "#06b6d4",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_993ac691660d3d67b500d995e121b220.png?size=240&passthrough=true"
        },
        {
                "id": "frame-sproutling",
                "name": "sproutling",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_3012fad396abbf24e325431800b51510.png?size=240&passthrough=true"
        },
        {
                "id": "frame-fall-leaves",
                "name": "fall Leaves",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_5087f7f988bd1b2819cac3e33d0150f5.png?size=240&passthrough=true"
        },
        {
                "id": "frame-doodling",
                "name": "Doodling",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_5873ecaa76fb549654b40095293f902e.png?size=240&passthrough=true"
        },
        {
                "id": "frame-sleepy-chilledcow",
                "name": "Sleepy chilledcow",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_6649e251a23f24935471ee02c212675b.png?size=240&passthrough=true"
        },
        {
                "id": "frame-armamenter",
                "name": "Armamenter",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_6912c651e979fbfdc479ed082a571513.png?size=240&passthrough=true"
        },
        {
                "id": "frame-sakura-lnk",
                "name": "sakura lnk",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_13913a00bd9990ab4102a3bf069f0f3f.png?size=240&passthrough=true"
        },
        {
                "id": "frame-sushi-roll",
                "name": "sushi roll",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_44045ae47175eaca4ed1b4d889b62b27.png?size=240&passthrough=true"
        },
        {
                "id": "frame-string-lights",
                "name": "string Lights",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_47136c333dc989a0f0f9852e878d3844.png?size=160&passthrough=true"
        },
        {
                "id": "frame-feelin-awe",
                "name": "Feelin' awe",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_89155faed81b205d59fbbefa4316952d.png?size=240&passthrough=true"
        },
        {
                "id": "frame-dice",
                "name": "Dice",
                "category": "Game",
                "tag": "Esports & Gaming",
                "color": "#06b6d4",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_94191be95bb9c471ff17644f3639eb6d.png?size=240&passthrough=true"
        },
        {
                "id": "frame-joystick",
                "name": "Joystick",
                "category": "Game",
                "tag": "Esports & Gaming",
                "color": "#06b6d4",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_795573a62c6d9b583f3029100f90d56b.png?size=240&passthrough=true"
        },
        {
                "id": "frame-got-xenoglossy",
                "name": "Got xenoglossy",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_35713167cc82e0f408c26dfc032a7f0f.png?size=160&passthrough=true"
        },
        {
                "id": "frame-dandelion-duo",
                "name": "Dandelion Duo",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_629689577fa1da2ef0061a5a8c930de1.png?size=240&passthrough=true"
        },
        {
                "id": "frame-rage",
                "name": "Rage",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_a0db4314b8cc271c8f472357aa895005.png?size=240&passthrough=true"
        },
        {
                "id": "frame-fresh-pine",
                "name": "Fresh pine",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_a0fafb7c7ee7f1e5b1442f44f3aa14b7.png?size=240&passthrough=true"
        },
        {
                "id": "frame-city-walls",
                "name": "city walls",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_a4e8e02dbbba6889428c744df7aa5a81.png?size=240&passthrough=true"
        },
        {
                "id": "frame-bowler-hat",
                "name": "Bowler hat",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_a67833d0f3138d7dcdee98c39eae33d7.png?size=240&passthrough=true"
        },
        {
                "id": "frame-the-petal-pack",
                "name": "The petal pack",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_ab95c78401ce4ec85c25a6d308db9d85.png?size=240&passthrough=true"
        },
        {
                "id": "frame-shocked",
                "name": "shocked",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_b98e8b204d59882fb7f9f7c86922c0bf.png?size=240&passthrough=true"
        },
        {
                "id": "frame-helmsman",
                "name": "Helmsman",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_b98093bb7723235a4cd2792762795640.png?size=240&passthrough=true"
        },
        {
                "id": "frame-fall-leaves",
                "name": "Fall Leaves",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_bc63175fe462d8748b68ea5179249418.png?size=160&passthrough=true"
        },
        {
                "id": "frame-mix-string-light-bundle",
                "name": "Mix string Light bundle",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_dff769a0f922bb56ab0d4ba2bcbacfae.png?size=160&passthrough=true"
        },
        {
                "id": "frame-feelin-panic",
                "name": "Feelin' Panic",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_f11c214394044d001d81c983dcab354f.png?size=240&passthrough=true"
        },
        {
                "id": "frame-pinterest-3ccf30ed73de",
                "name": "Pastel Dotted Circle Ring",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Accent",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "assets/pinterest_rings_cropped/ring_3ccf30ed73de76b7fdb15f23bd5e3e11.png"
        },
        {
                "id": "frame-pinterest-9051eecca544",
                "name": "Pastel Dotted Circle Ring #40",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Accent",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "assets/pinterest_rings_cropped/ring_9051eecca5449d2e423b9844a1dde048.png"
        },
        {
                "id": "frame-pinterest-pin_c6fdda",
                "name": "Pastel Dotted Circle Ring #60",
                "category": "Pinterest",
                "tag": "\ud83d\udccc Accent",
                "color": "#38bdf8",
                "tier": "B Tier",
                "tierBadge": "\ud83e\udd48 B TIER",
                "tierColor": "#38bdf8",
                "tierRank": 4,
                "imageSrc": "assets/pinterest_rings_cropped/ring_pin_c6fdda.png"
        },
        {
                "id": "frame-feelin-nervous",
                "name": "Feelin'Nervous",
                "category": "Anime",
                "tag": "Anime & Kawaii",
                "color": "#f472b6",
                "tier": "C Tier",
                "tierBadge": "\ud83e\udd49 C TIER",
                "tierColor": "#94a3b8",
                "tierRank": 5,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_2d792aad5003faf6809e26879a7eae6b.png?size=240&passthrough=true"
        },
        {
                "id": "frame-crossbones",
                "name": "Crossbones",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "C Tier",
                "tierBadge": "\ud83e\udd49 C TIER",
                "tierColor": "#94a3b8",
                "tierRank": 5,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_7f863078aee4932cd50ee4e3b55d3035.png?size=240&passthrough=true"
        },
        {
                "id": "frame-pipedream",
                "name": "Pipedream",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "C Tier",
                "tierBadge": "\ud83e\udd49 C TIER",
                "tierColor": "#94a3b8",
                "tierRank": 5,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_8c17e799bfeffa797042569a1ebcafc0.png?size=240&passthrough=true"
        },
        {
                "id": "frame-feelin-scrumptious",
                "name": "Feelin'Scrumptious",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "C Tier",
                "tierBadge": "\ud83e\udd49 C TIER",
                "tierColor": "#94a3b8",
                "tierRank": 5,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_9d35467f282b8c72a26f5aa40aa2a637.png?size=240&passthrough=true"
        },
        {
                "id": "frame-dismay",
                "name": "Dismay",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "C Tier",
                "tierBadge": "\ud83e\udd49 C TIER",
                "tierColor": "#94a3b8",
                "tierRank": 5,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_51d3bb502109eec26c76386ec980bc8b.png?size=240&passthrough=true"
        },
        {
                "id": "frame-sweat-drops",
                "name": "Sweat Drops",
                "category": "Elemental",
                "tag": "Elemental & Magic",
                "color": "#38bdf8",
                "tier": "C Tier",
                "tierBadge": "\ud83e\udd49 C TIER",
                "tierColor": "#94a3b8",
                "tierRank": 5,
                "imageSrc": "https://cdn.discordapp.com/avatar-decoration-presets/a_55c9d0354290afa8b7fe47ea9bd7dbcf.png?size=240&passthrough=true"
        }
],
    curatedMonogramThemes: [
        { id: "mono-theme-default", name: "Active Theme", bg: "var(--accent)", color: "var(--text-inverse)" },
        { id: "mono-theme-cyber", name: "Cyan Cyber", bg: "#06b6d4", color: "#000000" },
        { id: "mono-theme-gold", name: "Royal Gold", bg: "#f59e0b", color: "#000000" },
        { id: "mono-theme-emerald", name: "Matcha Jade", bg: "#10b981", color: "#ffffff" },
        { id: "mono-theme-violet", name: "Synth Violet", bg: "#8b5cf6", color: "#ffffff" },
        { id: "mono-theme-crimson", name: "Crimson Red", bg: "#ef4444", color: "#ffffff" },
        { id: "mono-theme-obsidian", name: "Pure Obsidian", bg: "#18181b", color: "#f4f4f5" }
    ],
    curatedProfilePics: [],
    profileBanners: [
        {
            "id": "banner-sai-01",
            "name": "Shadow Monarch Realm",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_01.jpg"
        },
        {
            "id": "banner-sai-02",
            "name": "Eclipse Cyber Katana",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_02.jpg"
        },
        {
            "id": "banner-sai-03",
            "name": "Synthwave Sunset Drive",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_03.jpg"
        },
        {
            "id": "banner-sai-04",
            "name": "Dark Shinobi Twilight",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_04.jpg"
        },
        {
            "id": "banner-sai-05",
            "name": "Gothic Crimson Abyss",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_05.jpg"
        },
        {
            "id": "banner-sai-06",
            "name": "Cyber Neon Skyline",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_06.jpg"
        },
        {
            "id": "banner-sai-07",
            "name": "Celestial Starfall",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_07.jpg"
        },
        {
            "id": "banner-sai-08",
            "name": "Monochrome Void Walker",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_08.jpg"
        },
        {
            "id": "banner-sai-09",
            "name": "Phantom Dragon Breath",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_09.jpg"
        },
        {
            "id": "banner-sai-10",
            "name": "Electric Blue Shuriken",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_10.png"
        },
        {
            "id": "banner-sai-11",
            "name": "Midnight Lofi Rainfall",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_11.jpg"
        },
        {
            "id": "banner-sai-12",
            "name": "Obsidian Edge Bankai",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_12.jpg"
        },
        {
            "id": "banner-sai-13",
            "name": "Vaporwave Horizon",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_13.jpg"
        },
        {
            "id": "banner-sai-14",
            "name": "Demon Slayer Ember",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_14.jpg"
        },
        {
            "id": "banner-sai-15",
            "name": "Infinite Domain Expansion",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_15.png"
        },
        {
            "id": "banner-sai-16",
            "name": "Scarlet Moon Sovereign",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_16.jpg"
        },
        {
            "id": "banner-sai-17",
            "name": "Tokyo Neon Glitch",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_17.jpg"
        },
        {
            "id": "banner-sai-18",
            "name": "Silent Samurai Stance",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_18.jpg"
        },
        {
            "id": "banner-sai-19",
            "name": "Cybernetic Pulse Core",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_19.jpg"
        },
        {
            "id": "banner-sai-20",
            "name": "Astral Rift Wanderer",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_20.jpg"
        },
        {
            "id": "banner-sai-21",
            "name": "Shadow Dagger Strike",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_21.jpg"
        },
        {
            "id": "banner-sai-22",
            "name": "Golden Aura Sovereign",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_22.jpg"
        },
        {
            "id": "banner-sai-23",
            "name": "Dark Hollow Metamorphosis",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_23.png"
        },
        {
            "id": "banner-sai-24",
            "name": "Cyberpunk City Grid",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_24.jpg"
        },
        {
            "id": "banner-sai-25",
            "name": "Ethereal Ghost Flame",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_25.jpg"
        },
        {
            "id": "banner-sai-26",
            "name": "Blood Moon Requiem",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_26.jpg"
        },
        {
            "id": "banner-sai-27",
            "name": "Zenith Nebula Horizon",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_27.jpg"
        },
        {
            "id": "banner-sai-28",
            "name": "Titan Crest Vanguard",
            "tier": "Legendary",
            "tierBadge": "\ud83d\udc51 S+ Sovereign",
            "tierColor": "#fbbf24",
            "tierRank": 1,
            "category": "\ud83d\udc51 Featured Ring Pins",
            "tag": "\u2728 Pinterest Curated",
            "imageSrc": "assets/banners/user/sai_banner_28.jpg"
        },

        {
                "id": "banner-solo-leveling-arise",
                "name": "Shadow Monarch Arise",
                "category": "Anime",
                "tag": "Solo Leveling",
                "color": "#a855f7",
                "tier": "Legendary",
                "tierBadge": "\ud83d\udc51 Legendary",
                "tierColor": "#fbbf24",
                "tierRank": 1,
                "imageSrc": "assets/banners/banner_solo_leveling_arise.jpg"
        },
        {
                "id": "banner-cyberpunk-edgerunners",
                "name": "Edgerunners Neon Moon",
                "category": "Cyber",
                "tag": "Cyberpunk 2077",
                "color": "#00f3ff",
                "tier": "Legendary",
                "tierBadge": "\ud83d\udc51 Legendary",
                "tierColor": "#fbbf24",
                "tierRank": 1,
                "imageSrc": "assets/banners/banner_cyberpunk_edgerunners.jpg"
        },
        {
                "id": "banner-arcane-zaun-shimmer",
                "name": "Arcane Jinx Shimmer",
                "category": "Game",
                "tag": "Arcane / LoL",
                "color": "#ec4899",
                "tier": "Legendary",
                "tierBadge": "\ud83d\udc51 Legendary",
                "tierColor": "#fbbf24",
                "tierRank": 1,
                "imageSrc": "assets/banners/banner_arcane_zaun_shimmer.jpg"
        },
        {
                "id": "banner-demon-slayer-flame",
                "name": "Hinokami Flame Dragon",
                "category": "Anime",
                "tag": "Demon Slayer",
                "color": "#ef4444",
                "tier": "Legendary",
                "tierBadge": "\ud83d\udc51 Legendary",
                "tierColor": "#fbbf24",
                "tierRank": 1,
                "imageSrc": "assets/banners/banner_demon_slayer_flame.jpg"
        },
        {
                "id": "banner-jjk-infinite-void",
                "name": "Gojo Infinite Void",
                "category": "Anime",
                "tag": "Jujutsu Kaisen",
                "color": "#8b5cf6",
                "tier": "Legendary",
                "tierBadge": "\ud83d\udc51 Legendary",
                "tierColor": "#fbbf24",
                "tierRank": 1,
                "imageSrc": "assets/banners/banner_jjk_infinite_void.jpg"
        },
        {
                "id": "banner-valorant-champions",
                "name": "Valorant Radiant Arena",
                "category": "Game",
                "tag": "Esports Champions",
                "color": "#fbbf24",
                "tier": "Legendary",
                "tierBadge": "\ud83d\udc51 Legendary",
                "tierColor": "#fbbf24",
                "tierRank": 1,
                "imageSrc": "assets/banners/banner_valorant_champions.jpg"
        },
        {
                "id": "banner-genshin-celestia",
                "name": "Celestia Divine Throne",
                "category": "Anime",
                "tag": "Genshin Impact",
                "color": "#38bdf8",
                "tier": "Legendary",
                "tierBadge": "\ud83d\udc51 Legendary",
                "tierColor": "#fbbf24",
                "tierRank": 1,
                "imageSrc": "assets/banners/banner_genshin_celestia.jpg"
        },
        {
                "id": "banner-honkai-star-rail",
                "name": "Astral Express Supernova",
                "category": "Cosmic",
                "tag": "Star Rail",
                "color": "#eab308",
                "tier": "Legendary",
                "tierBadge": "\ud83d\udc51 Legendary",
                "tierColor": "#fbbf24",
                "tierRank": 1,
                "imageSrc": "assets/banners/banner_honkai_star_rail.jpg"
        },
        {
                "id": "banner-dragon-apocalypse",
                "name": "Ancient Dragon Cataclysm",
                "category": "Dragon",
                "tag": "Mythic Fire",
                "color": "#f97316",
                "tier": "Legendary",
                "tierBadge": "\ud83d\udc51 Legendary",
                "tierColor": "#fbbf24",
                "tierRank": 1,
                "imageSrc": "assets/banners/banner_dragon_apocalypse.jpg"
        },
        {
                "id": "banner-celestial-aurora-storm",
                "name": "Celestial Aurora Storm",
                "category": "Cosmic",
                "tag": "Polar Aurora",
                "color": "#10b981",
                "tier": "Legendary",
                "tierBadge": "\ud83d\udc51 Legendary",
                "tierColor": "#fbbf24",
                "tierRank": 1,
                "imageSrc": "assets/banners/banner_celestial_aurora_storm.jpg"
        },
        {
                "id": "banner-blood-moon-eclipse",
                "name": "Blood Moon Crimson Eclipse",
                "category": "Anime",
                "tag": "Dark Fantasy",
                "color": "#991b1b",
                "tier": "Legendary",
                "tierBadge": "\ud83d\udc51 Legendary",
                "tierColor": "#fbbf24",
                "tierRank": 1,
                "imageSrc": "assets/banners/banner_blood_moon_eclipse.jpg"
        },
        {
                "id": "banner-imperial-sovereign-gold",
                "name": "24K Sovereign Golden Crest",
                "category": "Royal",
                "tag": "Royal Gold",
                "color": "#fbbf24",
                "tier": "Legendary",
                "tierBadge": "\ud83d\udc51 Legendary",
                "tierColor": "#fbbf24",
                "tierRank": 1,
                "imageSrc": "assets/banners/banner_imperial_sovereign_gold.jpg"
        },
        {
                "id": "banner-tokyo-shibuya-night",
                "name": "Tokyo Shibuya Cyber Grid",
                "category": "Cyber",
                "tag": "Tokyo Cyber",
                "color": "#00f3ff",
                "tier": "Epic",
                "tierBadge": "\ud83d\udc8e Epic",
                "tierColor": "#a855f7",
                "tierRank": 2,
                "imageSrc": "assets/banners/banner_tokyo_shibuya_night.jpg"
        },
        {
                "id": "banner-synthwave-sunset-80s",
                "name": "Synthwave 80s Sunset Grid",
                "category": "Cyber",
                "tag": "Vaporwave",
                "color": "#ec4899",
                "tier": "Epic",
                "tierBadge": "\ud83d\udc8e Epic",
                "tierColor": "#a855f7",
                "tierRank": 2,
                "imageSrc": "assets/banners/banner_synthwave_sunset_80s.jpg"
        },
        {
                "id": "banner-cosmic-deep-nebula",
                "name": "Deep Cosmic Stardust Nebula",
                "category": "Cosmic",
                "tag": "Galaxy Vortex",
                "color": "#c084fc",
                "tier": "Epic",
                "tierBadge": "\ud83d\udc8e Epic",
                "tierColor": "#a855f7",
                "tierRank": 2,
                "imageSrc": "assets/banners/banner_cosmic_deep_nebula.jpg"
        },
        {
                "id": "banner-tokyo-sakura-twilight",
                "name": "Tokyo Sakura Petals Drift",
                "category": "Anime",
                "tag": "Cherry Blossom",
                "color": "#f472b6",
                "tier": "Epic",
                "tierBadge": "\ud83d\udc8e Epic",
                "tierColor": "#a855f7",
                "tierRank": 2,
                "imageSrc": "assets/banners/banner_tokyo_sakura_twilight.jpg"
        },
        {
                "id": "banner-lofi-midnight-rain",
                "name": "Lo-Fi Midnight Rainy Window",
                "category": "Lo-Fi",
                "tag": "Midnight Rain",
                "color": "#818cf8",
                "tier": "Epic",
                "tierBadge": "\ud83d\udc8e Epic",
                "tierColor": "#a855f7",
                "tierRank": 2,
                "imageSrc": "assets/banners/banner_lofi_midnight_rain.jpg"
        },
        {
                "id": "banner-glacial-frost-peaks",
                "name": "Glacial Crystal Blizzard",
                "category": "Elemental",
                "tag": "Ice Frost",
                "color": "#38bdf8",
                "tier": "Epic",
                "tierBadge": "\ud83d\udc8e Epic",
                "tierColor": "#a855f7",
                "tierRank": 2,
                "imageSrc": "assets/banners/banner_glacial_frost_peaks.jpg"
        },
        {
                "id": "banner-anime-spirited-garden",
                "name": "Spirited Blossom Garden",
                "category": "Anime",
                "tag": "Spirit Realm",
                "color": "#c084fc",
                "tier": "Epic",
                "tierBadge": "\ud83d\udc8e Epic",
                "tierColor": "#a855f7",
                "tierRank": 2,
                "imageSrc": "assets/banners/banner_anime_spirited_garden.jpg"
        },
        {
                "id": "banner-cyber-matrix-digital",
                "name": "Cyber Matrix Digital Glyphs",
                "category": "Cyber",
                "tag": "Matrix Code",
                "color": "#22c55e",
                "tier": "Epic",
                "tierBadge": "\ud83d\udc8e Epic",
                "tierColor": "#a855f7",
                "tierRank": 2,
                "imageSrc": "assets/banners/banner_cyber_matrix_digital.jpg"
        },
        {
                "id": "banner-neo-tokyo-night-market",
                "name": "Neo-Tokyo Night Lanterns",
                "category": "Cyber",
                "tag": "Neon City",
                "color": "#f43f5e",
                "tier": "Epic",
                "tierBadge": "\ud83d\udc8e Epic",
                "tierColor": "#a855f7",
                "tierRank": 2,
                "imageSrc": "assets/banners/banner_neo_tokyo_night_market.jpg"
        },
        {
                "id": "banner-deep-space-hyperdrive",
                "name": "Hyperdrive Warp Speed",
                "category": "Cosmic",
                "tag": "Deep Space",
                "color": "#60a5fa",
                "tier": "Epic",
                "tierBadge": "\ud83d\udc8e Epic",
                "tierColor": "#a855f7",
                "tierRank": 2,
                "imageSrc": "assets/banners/banner_deep_space_hyperdrive.jpg"
        },
        {
                "id": "banner-steampunk-clockwork",
                "name": "Steampunk Chrono Clockwork",
                "category": "Cyber",
                "tag": "Steampunk",
                "color": "#d97706",
                "tier": "Epic",
                "tierBadge": "\ud83d\udc8e Epic",
                "tierColor": "#a855f7",
                "tierRank": 2,
                "imageSrc": "assets/banners/banner_steampunk_clockwork.jpg"
        },
        {
                "id": "banner-shadow-monarch",
                "name": "Shadow Extraction Realm",
                "category": "Anime",
                "tag": "Solo Leveling",
                "color": "#a855f7",
                "tier": "Epic",
                "tierBadge": "\ud83d\udc8e Epic",
                "tierColor": "#a855f7",
                "tierRank": 2,
                "imageSrc": "assets/banners/banner_shadow_monarch.jpg"
        },
        {
                "id": "banner-ghibli-matcha-forest",
                "name": "Ghibli Matcha Pine Forest",
                "category": "Anime",
                "tag": "Ghibli Zen",
                "color": "#10b981",
                "tier": "Rare",
                "tierBadge": "\ud83d\udd2e Rare",
                "tierColor": "#38bdf8",
                "tierRank": 3,
                "imageSrc": "assets/banners/banner_ghibli_matcha_forest.jpg"
        },
        {
                "id": "banner-pastel-sunset-clouds",
                "name": "Pastel Cotton Sunset Sky",
                "category": "Lo-Fi",
                "tag": "Dream Cloud",
                "color": "#f472b6",
                "tier": "Rare",
                "tierBadge": "\ud83d\udd2e Rare",
                "tierColor": "#38bdf8",
                "tierRank": 3,
                "imageSrc": "assets/banners/banner_pastel_sunset_clouds.jpg"
        },
        {
                "id": "banner-rainy-coffee-cafe",
                "name": "Rainy Cafe Cozy Study",
                "category": "Lo-Fi",
                "tag": "Coffee Cozy",
                "color": "#d97706",
                "tier": "Rare",
                "tierBadge": "\ud83d\udd2e Rare",
                "tierColor": "#38bdf8",
                "tierRank": 3,
                "imageSrc": "assets/banners/banner_rainy_coffee_cafe.jpg"
        },
        {
                "id": "banner-pixel-8bit-horizon",
                "name": "8-Bit Retro Pixel Arcade",
                "category": "Game",
                "tag": "Pixel Art",
                "color": "#a855f7",
                "tier": "Rare",
                "tierBadge": "\ud83d\udd2e Rare",
                "tierColor": "#38bdf8",
                "tierRank": 3,
                "imageSrc": "assets/banners/banner_pixel_8bit_horizon.jpg"
        },
        {
                "id": "banner-lavender-twilight-field",
                "name": "Lavender Twilight Horizon",
                "category": "Anime",
                "tag": "Floral Meadow",
                "color": "#c084fc",
                "tier": "Rare",
                "tierBadge": "\ud83d\udd2e Rare",
                "tierColor": "#38bdf8",
                "tierRank": 3,
                "imageSrc": "assets/banners/banner_lavender_twilight_field.jpg"
        },
        {
                "id": "banner-golden-desert-oasis",
                "name": "Golden Dunes Desert Oasis",
                "category": "Elemental",
                "tag": "Desert Star",
                "color": "#f59e0b",
                "tier": "Rare",
                "tierBadge": "\ud83d\udd2e Rare",
                "tierColor": "#38bdf8",
                "tierRank": 3,
                "imageSrc": "assets/banners/banner_golden_desert_oasis.jpg"
        },
        {
                "id": "banner-autumn-maple-drift",
                "name": "Autumn Maple Leaves Drift",
                "category": "Elemental",
                "tag": "Maple Drift",
                "color": "#ea580c",
                "tier": "Rare",
                "tierBadge": "\ud83d\udd2e Rare",
                "tierColor": "#38bdf8",
                "tierRank": 3,
                "imageSrc": "assets/banners/banner_autumn_maple_drift.jpg"
        },
        {
                "id": "banner-deep-ocean-bioluminescence",
                "name": "Bioluminescent Deep Ocean",
                "category": "Elemental",
                "tag": "Deep Ocean",
                "color": "#06b6d4",
                "tier": "Rare",
                "tierBadge": "\ud83d\udd2e Rare",
                "tierColor": "#38bdf8",
                "tierRank": 3,
                "imageSrc": "assets/banners/banner_deep_ocean_bioluminescence.jpg"
        },
        {
                "id": "banner-zen-bamboo-morning",
                "name": "Zen Bamboo Morning Dew",
                "category": "Anime",
                "tag": "Bamboo Zen",
                "color": "#22c55e",
                "tier": "Rare",
                "tierBadge": "\ud83d\udd2e Rare",
                "tierColor": "#38bdf8",
                "tierRank": 3,
                "imageSrc": "assets/banners/banner_zen_bamboo_morning.jpg"
        },
        {
                "id": "banner-starry-night-sky",
                "name": "Starry Sky Celestial Horizon",
                "category": "Cosmic",
                "tag": "Starry Sky",
                "color": "#3b82f6",
                "tier": "Rare",
                "tierBadge": "\ud83d\udd2e Rare",
                "tierColor": "#38bdf8",
                "tierRank": 3,
                "imageSrc": "assets/banners/banner_starry_night_sky.jpg"
        },
        {
                "id": "banner-vintage-cartography-map",
                "name": "Vintage Antique Constellation",
                "category": "Royal",
                "tag": "Celestial Map",
                "color": "#d97706",
                "tier": "Rare",
                "tierBadge": "\ud83d\udd2e Rare",
                "tierColor": "#38bdf8",
                "tierRank": 3,
                "imageSrc": "assets/banners/banner_vintage_cartography_map.jpg"
        },
        {
                "id": "banner-cyber-shibuya",
                "name": "Cyber Shibuya Rain",
                "category": "Cyber",
                "tag": "Cyberpunk",
                "color": "#00f3ff",
                "tier": "Rare",
                "tierBadge": "\ud83d\udd2e Rare",
                "tierColor": "#38bdf8",
                "tierRank": 3,
                "imageSrc": "assets/banners/banner_cyber_shibuya.jpg"
        },
        {
                "id": "banner-classic-blurple-waves",
                "name": "Classic Blurple Nitro Waves",
                "category": "Royal",
                "tag": "Signature",
                "color": "#5865f2",
                "tier": "Common",
                "tierBadge": "\u26aa Common",
                "tierColor": "#94a3b8",
                "tierRank": 4,
                "imageSrc": "assets/banners/banner_classic_blurple_waves.jpg"
        },
        {
                "id": "banner-stealth-carbon-mesh",
                "name": "Stealth Carbon Fiber Weave",
                "category": "Cyber",
                "tag": "Stealth",
                "color": "#71717a",
                "tier": "Common",
                "tierBadge": "\u26aa Common",
                "tierColor": "#94a3b8",
                "tierRank": 4,
                "imageSrc": "assets/banners/banner_stealth_carbon_mesh.jpg"
        },
        {
                "id": "banner-obsidian-slate-minimal",
                "name": "Pure Obsidian Dark Slate",
                "category": "Royal",
                "tag": "Minimal Slate",
                "color": "#52525b",
                "tier": "Common",
                "tierBadge": "\u26aa Common",
                "tierColor": "#94a3b8",
                "tierRank": 4,
                "imageSrc": "assets/banners/banner_obsidian_slate_minimal.jpg"
        },
        {
                "id": "banner-crimson-velvet-texture",
                "name": "Crimson Velvet Dark Texture",
                "category": "Dragon",
                "tag": "Velvet Red",
                "color": "#ef4444",
                "tier": "Common",
                "tierBadge": "\u26aa Common",
                "tierColor": "#94a3b8",
                "tierRank": 4,
                "imageSrc": "assets/banners/banner_crimson_velvet_texture.jpg"
        },
        {
                "id": "banner-emerald-jade-minimal",
                "name": "Emerald Jade Minimal Dark",
                "category": "Anime",
                "tag": "Jade Minimal",
                "color": "#10b981",
                "tier": "Common",
                "tierBadge": "\u26aa Common",
                "tierColor": "#94a3b8",
                "tierRank": 4,
                "imageSrc": "assets/banners/banner_emerald_jade_minimal.jpg"
        },
        {
                "id": "banner-royal-amethyst-dark",
                "name": "Royal Amethyst Dark Velvet",
                "category": "Royal",
                "tag": "Amethyst",
                "color": "#8b5cf6",
                "tier": "Common",
                "tierBadge": "\u26aa Common",
                "tierColor": "#94a3b8",
                "tierRank": 4,
                "imageSrc": "assets/banners/banner_royal_amethyst_dark.jpg"
        },
        {
                "id": "banner-brushed-steel-navy",
                "name": "Brushed Steel Navy Circuit",
                "category": "Game",
                "tag": "Navy Tech",
                "color": "#38bdf8",
                "tier": "Common",
                "tierBadge": "\u26aa Common",
                "tierColor": "#94a3b8",
                "tierRank": 4,
                "imageSrc": "assets/banners/banner_brushed_steel_navy.jpg"
        },
        {
                "id": "banner-charcoal-mist-smoke",
                "name": "Charcoal Mist Monochrome",
                "category": "Elemental",
                "tag": "Monochrome",
                "color": "#a1a1aa",
                "tier": "Common",
                "tierBadge": "\u26aa Common",
                "tierColor": "#94a3b8",
                "tierRank": 4,
                "imageSrc": "assets/banners/banner_charcoal_mist_smoke.jpg"
        },
        {
                "id": "banner-champagne-gold-shimmer",
                "name": "Champagne Gold Muted Shimmer",
                "category": "Royal",
                "tag": "Muted Gold",
                "color": "#fbbf24",
                "tier": "Common",
                "tierBadge": "\u26aa Common",
                "tierColor": "#94a3b8",
                "tierRank": 4,
                "imageSrc": "assets/banners/banner_champagne_gold_shimmer.jpg"
        },
        {
                "id": "banner-app-theme-adaptive",
                "name": "App Theme Adaptive Spectrum",
                "category": "Game",
                "tag": "Dynamic Theme",
                "color": "#06b6d4",
                "tier": "Common",
                "tierBadge": "\u26aa Common",
                "tierColor": "#94a3b8",
                "tierRank": 4,
                "imageSrc": "assets/banners/banner_app_theme_adaptive.jpg"
        }
]
};

if (typeof window !== 'undefined') {
    window.SRM_DATA = SRM_DATA;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SRM_DATA;
}