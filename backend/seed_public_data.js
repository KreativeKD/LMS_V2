const mongoose = require('mongoose');
const Professor = require('./models/Professor');
const AcademicCourse = require('./models/AcademicCourse');
require('dotenv').config();

const professorsData = [
    {
        name: 'Dr. Kiran TALELE',
        designation: 'PhD, Associate Professor',
        dept: 'Electronics & Telecommunication Engineering',
        institution: 'Sardar Patel Institute of Technology, Mumbai',
        photo: '/ktalele.png',
        stats: {
            experience: '33+',
            publications: '85+',
            patents: '22',
            startups: '4'
        },
        contact: {
            website: 'https://www.talelesir.com',
            linkedin: 'https://www.linkedin.com/in/k-t-v-talele/',
            email: 'talelesir@gmail.com'
        },
        expertise: [
            'Digital Signal Processing', 'Image Processing', 'Computer Vision',
            'Machine Learning', 'Multimedia Systems', 'AI & Deep Learning'
        ],
        leadership: [
            { title: 'Dean of Students, Alumni & External Relations', org: 'Sardar Patel Institute of Technology (Since 2022)' },
            { title: 'Director - SP-TBI', org: 'Sardar Patel Technology Business Incubator (2025)' },
            { title: 'Treasurer', org: 'IEEE Bombay Section (Since 2020)' },
            { title: 'Mentor', org: 'Startup Incubation & Intellectual Asset Creation' }
        ],
        achievements: [
            { title: '85+ Research Publications', desc: 'Published in prestigious national and international conferences & journals' },
            { title: '22 Patents Filed', desc: 'Including utility patent granted by India (2021) and design patent by UK (2025)' },
            { title: 'Excellence Awards', desc: 'Recognized by SPIT Management (2008-09) & IEEE Bombay Outstanding Volunteer (2019)' }
        ],
        ventures: [
            { title: 'Co-founder & Director - Anudaan Jagruti (2024)', desc: 'Empowering communities through education and innovation' },
            { title: 'Co-founder & Director - CerenitySphere (2025)', desc: 'Advancing mental health through technology' }
        ],
        courses: [
            {
                id: 'dsp',
                title: 'Digital Signal Processing (DSP)',
                description: 'Master the fundamentals of processing discrete-time signals and systems. This course covers everything from basic signal theory to advanced filter design and implementation.',
                chapters: [
                    'Discrete-time Signals and Systems', 'Z-Transform and its Applications', 'Discrete Fourier Transform (DFT)',
                    'Fast Fourier Transform (FFT) Algorithms', 'Design of Digital IIR Filters', 'Design of Digital FIR Filters', 'Finite Word Length Effects'
                ]
            },
            {
                id: 'dip',
                title: 'Digital Image Processing (DIP)',
                description: 'Dive into the world of digital image processing. Learn how to manipulate, enhance, and extract information from digital images using state-of-the-art algorithms.',
                chapters: [
                    'Digital Image Fundamentals', 'Image Enhancement in Spatial Domain', 'Image Enhancement in Frequency Domain',
                    'Image Restoration and Reconstruction', 'Morphological Image Processing', 'Image Segmentation Techniques', 'Representation and Description'
                ]
            }
        ],
        testimonials: [
            { text: "Dr. Talele's expertise in DSP transformed my understanding of signal processing. His teaching style is exceptional and his guidance was invaluable for my research.", author: "Priya Sharma", role: "PhD Student, IIT Bombay" },
            { text: "The courses offered by Dr. Talele are comprehensive and industry-relevant. His mentorship helped me secure a position at a leading tech company.", author: "Rahul Mehta", role: "Alumni, Software Engineer" }
        ]
    },
    {
        name: 'Dr. Sarah Johnson',
        designation: 'PhD, Professor',
        dept: 'Computer Science',
        institution: 'Stanford University',
        photo: '/default-prof.png',
        stats: {
            experience: '28+',
            publications: '150+',
            patents: '18',
            startups: '1'
        },
        contact: {
            website: 'https://www.sarahjohnson.stanford.edu',
            linkedin: 'https://www.linkedin.com/in/sarah-johnson/',
            email: 'sarah.johnson@stanford.edu'
        },
        expertise: [
            'Artificial Intelligence', 'Machine Learning', 'Natural Language Processing',
            'Computer Vision', 'Robotics', 'Data Mining'
        ],
        leadership: [
            { title: 'Director of AI Research Lab', org: 'Stanford University (Since 2018)' },
            { title: 'Chair of Computer Science Department', org: 'Stanford University (2020-2023)' }
        ],
        achievements: [
            { title: '150+ Research Publications', desc: 'Published in top-tier conferences like NeurIPS, ICML, and CVPR' },
            { title: '18 Patents Granted', desc: 'In AI and machine learning technologies' },
            { title: 'Turing Award Nominee', desc: 'Recognized for contributions to AI research (2022)' }
        ],
        ventures: [
            { title: 'Co-founder - AI Startup Inc.', desc: 'Developing next-generation AI solutions for healthcare' }
        ],
        courses: [
            {
                id: 'ai-ml',
                title: 'Artificial Intelligence and Machine Learning',
                description: 'Comprehensive course covering AI fundamentals, machine learning algorithms, and practical applications in various domains.',
                chapters: [
                    'Introduction to AI', 'Machine Learning Basics', 'Supervised Learning', 'Unsupervised Learning', 'Deep Learning', 'Reinforcement Learning', 'AI Ethics and Applications'
                ]
            },
            {
                id: 'nlp',
                title: 'Natural Language Processing',
                description: 'Learn to process and understand human language using computational methods and deep learning techniques.',
                chapters: [
                    'Text Processing Fundamentals', 'Language Models', 'Named Entity Recognition', 'Sentiment Analysis', 'Machine Translation', 'Question Answering Systems', 'NLP Applications'
                ]
            }
        ],
        testimonials: [
            { text: "Dr. Johnson's AI course opened my eyes to the possibilities of machine learning. Her research insights and teaching methodology are unparalleled.", author: "Alex Chen", role: "Research Assistant, Stanford" },
            { text: "Working under Dr. Johnson's guidance on NLP projects was transformative. Her expertise in deep learning is exceptional.", author: "Maria Rodriguez", role: "Graduate Student, Stanford" }
        ]
    },
    {
        name: 'Dr. Michael Chen',
        designation: 'PhD, Assistant Professor',
        dept: 'Electrical Engineering',
        institution: 'University of California, Berkeley',
        photo: '/default-prof.png',
        stats: {
            experience: '15+',
            publications: '60+',
            patents: '8',
            startups: '1'
        },
        contact: {
            website: 'https://www.michaelchen.berkeley.edu',
            linkedin: 'https://www.linkedin.com/in/michael-chen/',
            email: 'michael.chen@berkeley.edu'
        },
        expertise: [
            'Embedded Systems', 'IoT', 'Cyber-Physical Systems',
            'Control Systems', 'Robotics', 'Sensor Networks'
        ],
        leadership: [
            { title: 'Director of Embedded Systems Lab', org: 'UC Berkeley (Since 2020)' }
        ],
        achievements: [
            { title: '60+ Publications', desc: 'In journals and conferences on embedded systems and IoT' },
            { title: '8 Patents', desc: 'Related to IoT devices and sensor technologies' },
            { title: 'Best Paper Award', desc: 'IEEE IoT Conference (2021)' }
        ],
        ventures: [
            { title: 'Founder - IoT Solutions LLC', desc: 'Providing innovative IoT solutions for smart cities' }
        ],
        courses: [
            {
                id: 'embedded',
                title: 'Embedded Systems Design',
                description: 'Design and implement embedded systems for real-world applications, covering hardware-software integration and optimization.',
                chapters: [
                    'Embedded System Fundamentals', 'Microcontrollers and Microprocessors', 'Real-Time Operating Systems', 'Sensor Integration', 'Communication Protocols', 'Power Management', 'System Optimization'
                ]
            },
            {
                id: 'iot',
                title: 'Internet of Things (IoT)',
                description: 'Explore the world of connected devices and IoT ecosystems, learning to build scalable and secure IoT solutions.',
                chapters: [
                    'IoT Architecture', 'Sensor Networks', 'Data Analytics for IoT', 'Security in IoT', 'Edge Computing', 'IoT Protocols', 'Case Studies'
                ]
            }
        ],
        testimonials: [
            { text: "Dr. Chen's embedded systems course provided me with practical skills that I use daily in my IoT projects. His hands-on approach is outstanding.", author: "James Wilson", role: "IoT Engineer, TechCorp" },
            { text: "The IoT course under Dr. Chen was incredibly insightful. His industry connections and real-world examples made learning engaging.", author: "Lisa Park", role: "Graduate Student, UC Berkeley" }
        ]
    }
];

const academicCoursesData = [
    { id: 'dsp', title: 'Digital Signal Processing (DSP)', description: 'Master the fundamentals of processing discrete-time signals and systems. This course covers everything from basic signal theory to advanced filter design and implementation.', professor: 'Dr. Kiran TALELE', duration: '12 weeks', level: 'Intermediate', students: '150+', icon: 'BarChart2', chapters: 7 },
    { id: 'dip', title: 'Digital Image Processing (DIP)', description: 'Dive into the world of digital image processing. Learn how to manipulate, enhance, and extract information from digital images using state-of-the-art algorithms.', professor: 'Dr. Kiran TALELE', duration: '10 weeks', level: 'Intermediate', students: '120+', icon: 'Sparkles', chapters: 7 },
    { id: 'ai-ml', title: 'Artificial Intelligence and Machine Learning', description: 'Comprehensive course covering AI fundamentals, machine learning algorithms, and practical applications in various domains.', professor: 'Dr. Sarah Johnson', duration: '16 weeks', level: 'Advanced', students: '200+', icon: 'Zap', chapters: 7 },
    { id: 'nlp', title: 'Natural Language Processing', description: 'Learn to process and understand human language using computational methods and deep learning techniques.', professor: 'Dr. Sarah Johnson', duration: '14 weeks', level: 'Advanced', students: '180+', icon: 'BookOpen', chapters: 7 },
    { id: 'embedded', title: 'Embedded Systems Design', description: 'Design and implement embedded systems for real-world applications, covering hardware-software integration and optimization.', professor: 'Dr. Michael Chen', duration: '12 weeks', level: 'Intermediate', students: '100+', icon: 'Zap', chapters: 7 },
    { id: 'iot', title: 'Internet of Things (IoT)', description: 'Explore the world of connected devices and IoT ecosystems, learning to build scalable and secure IoT solutions.', professor: 'Dr. Michael Chen', duration: '10 weeks', level: 'Intermediate', students: '90+', icon: 'Sparkles', chapters: 7 }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await Professor.deleteMany({});
        await AcademicCourse.deleteMany({});

        await Professor.insertMany(professorsData);
        console.log('Professors seeded');

        await AcademicCourse.insertMany(academicCoursesData);
        console.log('Academic Courses seeded');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
