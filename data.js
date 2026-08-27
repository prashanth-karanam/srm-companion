// SRM Student Companion - Offline-First Persistent Data Store
// Automatically verified against SRMIST Student Portal

var APP_BUILD_VERSION = "2.5.0";
var APP_BUILD_TIMESTAMP = "2026-08-27T11:13:00";
if (typeof window !== 'undefined') {
    window.APP_BUILD_VERSION = APP_BUILD_VERSION;
    window.APP_BUILD_TIMESTAMP = APP_BUILD_TIMESTAMP;
}

const SRM_DATA = {
    profile: {
    "name": "KARANAM SAI PRASANTH",
    "regNo": "RA2611026010283",
    "campus": "Faculty of Engineering and Technology, Kattankulathur",
    "batch": "Batch 1",
    "degree": "B.Tech 1st Year (2026 Batch)"
},
    courses: [
    {
        "code": "26CSE1002J",
        "title": "PROGRAMMING FOR PROBLEM SOLVING",
        "credits": 3,
        "theorySlot": "E",
        "labSlot": "P13, P14",
        "theoryFaculty": "SHEEBA RACHEL S [ 103905 ]",
        "labFaculty": "SHEEBA RACHEL S [ 103905 ]",
        "theoryLocation": "UB 6th Floor, Room 601 (Annexure-II)",
        "labLocation": "Tech Park 3rd Floor, Integrative Programming Lab (Annexure-I)",
        "category": "Discipline Courses (B/E/C)"
    },
    {
        "code": "26MAB1001T",
        "title": "CALCULUS AND LINEAR ALGEBRA",
        "credits": 4,
        "theorySlot": "B",
        "labSlot": null,
        "theoryFaculty": "DR. N. PARVATHI [ 100429 ]",
        "labFaculty": null,
        "theoryLocation": "UB 6th Floor, Room 601 (Annexure-II)",
        "labLocation": null,
        "category": "Discipline Courses (B/E/C)"
    },
    {
        "code": "26CYB1002J",
        "title": "CHEMISTRY FOR COMPUTER SCIENCE",
        "credits": 4,
        "theorySlot": "D",
        "labSlot": "P7, P8",
        "theoryFaculty": "DR. JOHN BOSCO A [ 101727 ]",
        "labFaculty": "DR. JOHN BOSCO A [ 101727 ]",
        "theoryLocation": "UB 6th Floor, Room 601 (Annexure-II)",
        "labLocation": "Chemistry Lab Block 1st Floor, Chemistry Laboratory 4 (Annexure-II)",
        "category": "Discipline Courses (B/E/C)"
    },
    {
        "code": "26BTB1001T",
        "title": "INTRODUCTION TO COMPUTATIONAL BIOLOGY",
        "credits": 2,
        "theorySlot": "A",
        "labSlot": null,
        "theoryFaculty": "SIVASANKARESWARI E [ 104015 ]",
        "labFaculty": null,
        "theoryLocation": "UB 6th Floor, Room 601 (Annexure-II)",
        "labLocation": null,
        "category": "Discipline Courses (B/E/C)"
    },
    {
        "code": "26MEE1001L",
        "title": "WORKSHOP PRACTICE",
        "credits": 2,
        "theorySlot": null,
        "labSlot": "P27, P28, P29, P30",
        "theoryFaculty": null,
        "labFaculty": "DR. MANOJ SAMSON R [ 101614 ]",
        "theoryLocation": null,
        "labLocation": "Basic Engineering Lab (BEL) Ground Floor, Sheet Metal Lab (Annexure-I)",
        "category": "Discipline Courses (B/E/C)"
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
        "date": "28-08-2026",
        "day": "Friday",
        "status": "Working day",
        "week": "Wk 6",
        "day_order": "Day 3",
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
        "day_order": "Day 4",
        "remarks": "-"
    },
    {
        "date": "01-09-2026",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 6",
        "day_order": "Day 5",
        "remarks": "-"
    },
    {
        "date": "02-09-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 7",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "03-09-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 7",
        "day_order": "Day 2",
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
        "day_order": "Day 3",
        "remarks": "-"
    },
    {
        "date": "08-09-2026",
        "day": "Tuesday",
        "status": "Working day",
        "week": "Wk 7",
        "day_order": "Day 4",
        "remarks": "-"
    },
    {
        "date": "09-09-2026",
        "day": "Wednesday",
        "status": "Working day",
        "week": "Wk 7",
        "day_order": "Day 5",
        "remarks": "-"
    },
    {
        "date": "10-09-2026",
        "day": "Thursday",
        "status": "Working day",
        "week": "Wk 8",
        "day_order": "Day 1",
        "remarks": "-"
    },
    {
        "date": "11-09-2026",
        "day": "Friday",
        "status": "Working day",
        "week": "Wk 8",
        "day_order": "Day 2",
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
            name: "DR. N. PARVATHI",
            empId: "100429",
            designation: "Professor & Academic Counselor",
            department: "Computational Mathematics & Data Analytics",
            cabin: "University Building (UB) 6th Floor, Cabin 604",
            email: "parvathi.n@srmist.edu.in",
            phone: "+91 44 2741 7000 (Ext: 100429)"
        },
        subBatch: "Section P1 • Sub-Batch P13",
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
            allocatedBlock: "Paari Block (Boys)",
            roomNumber: "Room 408",
            bed: "Bed B (Non-AC 3-Sharing)",
            wardenName: "Dr. K. Senthil Kumar",
            residentTutor: "Mr. R. Vignesh (4th Floor In-charge)",
            ambulanceHotline: "044-27453140 / 108 (SRM Hospital Casualty)"
        },
        clearances: {
            tuitionFeeStatus: "Paid (Receipt: SRMKTR/2026/894102)",
            hostelFeeStatus: "Paid (Receipt: SRMHTL/2026/10492)",
            libraryNoDues: "Clear (0 Fines Pending)",
            labBreakageStatus: "Clear (0 Damaged Equipments)"
        }
    },
    hostelMess: {
        hostels: [
            "Paari Block (Boys)",
            "Kaari Block (Boys)",
            "Oori Block (Boys)",
            "Adhiyaman Block (Boys)",
            "Nelson Mandela (Boys)",
            "M-Block (International Boys)",
            "Begum Block (Girls)",
            "Senbaga Block (Girls)",
            "Meenakshi Block (Girls)",
            "Kalpana Chawla (Girls)",
            "Sannasi Block (Boys)"
        ],
        timings: {
            breakfast: { label: "Breakfast", start: "07:30", end: "09:30", icon: "🍳" },
            lunch: { label: "Lunch", start: "12:00", end: "14:15", icon: "🍛" },
            snacks: { label: "Evening Tea & Snacks", start: "16:30", end: "17:45", icon: "☕" },
            dinner: { label: "Dinner", start: "19:30", end: "21:30", icon: "🍲" }
        },
        weeklyMenu: {
            "Monday": {
                breakfast: "Idli, Medu Vada, Madras Sambar, Coconut Chutney, Bread Butter Jam, Tea/Coffee/Milk, Boiled Egg/Banana",
                lunch: "Jeera Rice, White Rice, Yellow Dal Tadka, Aloo Gobi Masala, Kara Kuzhambu, Curd, Appalam, Pickle",
                snacks: "Veg Cutlet, Green Mint Chutney, Masala Chai, Filter Coffee",
                dinner: "Phulka Roti, Paneer Butter Masala (Special Veg), Chicken Sukka (Non-Veg), White Rice, Dal Makhani, Rasam, Curd, Gulab Jamun"
            },
            "Tuesday": {
                breakfast: "Puri Bhaji, Aloo Masala Curry, Poha, Bread Omelette/Fruit, Tea/Coffee/Milk",
                lunch: "Veg Pulao, Steamed Rice, Tomato Dal, Bhindi Do Pyaza, Mor Kuzhambu, Curd, Fryums, Seasonal Fruit",
                snacks: "Hot Samosa, Sweet Tamarind Chutney, Tea, Coffee",
                dinner: "Butter Naan, Kadai Veg, Egg Curry / Paneer Lababdar, Ghee Rice, Dal Tadka, Rasam, Curd, Fruit Custard"
            },
            "Wednesday": {
                breakfast: "Ghee Pongal, Medu Vada, Coconut Chutney, Sambar, Bread Toast & Jam, Boiled Egg/Fruit, Tea/Coffee",
                lunch: "Chicken Biryani (Non-Veg), Hyderabadi Paneer Dum Biryani (Veg), Mirchi Ka Salan, Onion Raita, Dal Fry, Ice Cream",
                snacks: "Onion Pakoda, Masala Peanut Chaat, Ginger Tea, Coffee",
                dinner: "Chapati, Mixed Veg Kurma, White Rice, Dal Fry, Garlic Rasam, Curd, Sweet Boondi"
            },
            "Thursday": {
                breakfast: "Masala Dosa, Potato Masala, Onion Tomato Chutney, Sambar, Boiled Egg/Fruit, Tea/Coffee/Milk",
                lunch: "Lemon Rice, White Rice, Palak Dal, Aloo Capsicum Fry, Vatha Kuzhambu, Curd, Appalam",
                snacks: "Sweet Corn Butter Chaat, Hot Masala Tea, Filter Coffee",
                dinner: "Tandoori Roti, Chana Masala, Egg Bhurji / Shahi Paneer, Jeera Rice, Dal Tadka, Rasam, Curd, Kheer"
            },
            "Friday": {
                breakfast: "Rava Upma, Coconut Chutney, Sambar, Bread Butter Toast, Boiled Egg/Banana, Tea/Coffee/Milk",
                lunch: "South Indian Special Meals: White Rice, Sambar, Mysore Rasam, Potato Roast, Cabbage Poriyal, Curd, Payasam, Appalam",
                snacks: "Veg Puff, Tomato Sauce, Filter Coffee, Tea",
                dinner: "Phulka Roti, Malai Kofta (Veg), Pepper Chicken Masala (Non-Veg), Veg Fried Rice, Manchurian Gravy, Curd, Jalebi"
            },
            "Saturday": {
                breakfast: "Aloo Paratha, Curd, Mint Pickle, Bread Toast, Scrambled Egg/Fruit, Tea/Coffee/Milk",
                lunch: "Tomato Rice, Steamed Rice, Dal Palak, Veg Jalfrezi, Rasam, Curd, Crispy Potato Chips",
                snacks: "Pav Bhaji / Bhel Puri, Tea, Coffee",
                dinner: "Chapati, Rajma Masala, White Rice, Dal Fry, Tomato Rasam, Curd, Fruit Salad"
            },
            "Sunday": {
                breakfast: "Mysore Masala Dosa, Medu Vada, Sambar, Two Chutneys, Bread Jam, Boiled Egg, Tea/Coffee",
                lunch: "Special Sunday Feast: Chettinad Chicken Curry / Paneer Butter Masala, Ghee Rice, Dal Makhani, Poori, Rasam, Curd, Butterscotch Ice Cream",
                snacks: "Mysore Bonda, Chutney, Hot Tea, Coffee",
                dinner: "Soft Phulka, Veg Pulao, Kadai Paneer / Egg Curry, Dal Tadka, Rasam, Curd, Rasgulla"
            }
        }
    },
    campusClubs: [
        {
            id: "acm-ktr",
            name: "ACM SRM Student Chapter",
            category: "Technical",
            icon: "💻",
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
            icon: "⚡",
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
            icon: "🌐",
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
            icon: "🏎️",
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
            icon: "🎙️",
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
            icon: "🎭",
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
            icon: "📊",
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
    ]

};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SRM_DATA;
}
