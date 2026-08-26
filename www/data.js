// SRM Student Companion - Offline-First Persistent Data Store
// Automatically verified against SRMIST Student Portal

var APP_BUILD_VERSION = "2.4.2";
var APP_BUILD_TIMESTAMP = "2026-08-27T00:26:00";
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
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SRM_DATA;
}
