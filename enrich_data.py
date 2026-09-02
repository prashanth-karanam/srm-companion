with open("data.js", "r", encoding="utf-8") as f:
    content = f.read()

rich_data = '''
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
'''

# Insert before closing of SRM_DATA
if "passport:" not in content:
    target = "};\n\nif (typeof module !== 'undefined'"
    replacement = rich_data + "\n};\n\nif (typeof module !== 'undefined'"
    content = content.replace(target, replacement)
    with open("data.js", "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully enriched SRM_DATA with passport, hostelMess, campusClubs, and gradeScale!")
else:
    print("Already enriched!")
