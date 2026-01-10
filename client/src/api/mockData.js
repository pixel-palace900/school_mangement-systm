/**
 * Mock data for School Management System
 * This file contains comprehensive sample data for all modules to enable a standalone frontend demo.
 */

export const mockData = {
    // ============ USERS ============
    users: [
        {
            id: 'admin1',
            name: 'Dr. Sarah Anderson',
            email: 'admin@school.com',
            role: 'admin',
            phone: '+1-555-0100',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
        },
        {
            id: 'teacher1',
            name: 'John Smith',
            email: 'teacher@school.com',
            role: 'teacher',
            subject: 'Mathematics',
            phone: '+1-555-0101',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1'
        },
        {
            id: 'student1',
            name: 'Alice Johnson',
            email: 'student@school.com',
            role: 'student',
            grade: '10th',
            rollNo: '2024-101',
            phone: '+1-555-0102',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student1'
        },
        {
            id: 'parent1',
            name: 'Robert Johnson',
            email: 'parent@school.com',
            role: 'parent',
            phone: '+1-555-0103',
            children: ['Alice Johnson', 'Emma Johnson'],
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=parent1'
        },
    ],

    // ============ STUDENTS ============
    students: [
        {
            id: 's1',
            name: 'Alice Johnson',
            rollNo: '2024-101',
            email: 'alice.j@student.school.com',
            grade: '10',
            section: 'A',
            class: '10-A',
            dateOfBirth: '2009-05-15',
            gender: 'Female',
            phone: '+1-555-0201',
            address: '123 Main St, City',
            parentName: 'Robert Johnson',
            parentPhone: '+1-555-0103',
            attendance: 95,
            feesStatus: 'Paid',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'
        },
        {
            id: 's2',
            name: 'Bob Wilson',
            rollNo: '2024-102',
            email: 'bob.w@student.school.com',
            grade: '10',
            section: 'A',
            class: '10-A',
            dateOfBirth: '2009-08-22',
            gender: 'Male',
            phone: '+1-555-0202',
            address: '456 Oak Ave, City',
            parentName: 'Mary Wilson',
            parentPhone: '+1-555-0104',
            attendance: 88,
            feesStatus: 'Pending',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'
        },
        {
            id: 's3',
            name: 'Charlie Brown',
            rollNo: '2024-103',
            email: 'charlie.b@student.school.com',
            grade: '9',
            section: 'B',
            class: '9-B',
            dateOfBirth: '2010-03-10',
            gender: 'Male',
            phone: '+1-555-0203',
            address: '789 Pine Rd, City',
            parentName: 'David Brown',
            parentPhone: '+1-555-0105',
            attendance: 92,
            feesStatus: 'Paid',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie'
        },
        {
            id: 's4',
            name: 'Diana Martinez',
            rollNo: '2024-104',
            email: 'diana.m@student.school.com',
            grade: '10',
            section: 'B',
            class: '10-B',
            dateOfBirth: '2009-11-30',
            gender: 'Female',
            phone: '+1-555-0204',
            address: '321 Elm St, City',
            parentName: 'Carlos Martinez',
            parentPhone: '+1-555-0106',
            attendance: 97,
            feesStatus: 'Paid',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diana'
        },
        {
            id: 's5',
            name: 'Emma Johnson',
            rollNo: '2024-105',
            email: 'emma.j@student.school.com',
            grade: '8',
            section: 'A',
            class: '8-A',
            dateOfBirth: '2011-07-18',
            gender: 'Female',
            phone: '+1-555-0205',
            address: '123 Main St, City',
            parentName: 'Robert Johnson',
            parentPhone: '+1-555-0103',
            attendance: 93,
            feesStatus: 'Paid',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma'
        },
    ],

    // ============ TEACHERS ============
    teachers: [
        {
            id: 't1',
            name: 'John Smith',
            email: 'john.smith@school.com',
            subject: 'Mathematics',
            qualification: 'M.Sc Mathematics',
            experience: '10 years',
            phone: '+1-555-0301',
            dateOfJoining: '2014-08-15',
            classes: ['10-A', '10-B', '9-A'],
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=johnsmith'
        },
        {
            id: 't2',
            name: 'Sarah Davis',
            email: 'sarah.davis@school.com',
            subject: 'Science',
            qualification: 'Ph.D Physics',
            experience: '8 years',
            phone: '+1-555-0302',
            dateOfJoining: '2016-07-01',
            classes: ['9-B', '8-A', '8-B'],
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarahdavis'
        },
        {
            id: 't3',
            name: 'Michael Chen',
            email: 'michael.chen@school.com',
            subject: 'English',
            qualification: 'M.A English Literature',
            experience: '12 years',
            phone: '+1-555-0303',
            dateOfJoining: '2012-06-10',
            classes: ['10-A', '9-A', '9-B'],
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michaelchen'
        },
        {
            id: 't4',
            name: 'Emily Rodriguez',
            email: 'emily.rodriguez@school.com',
            subject: 'History',
            qualification: 'M.A History',
            experience: '6 years',
            phone: '+1-555-0304',
            dateOfJoining: '2018-08-20',
            classes: ['10-B', '8-A'],
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emilyrodriguez'
        },
    ],

    // ============ PARENTS ============
    parents: [
        {
            id: 'p1',
            name: 'Robert Johnson',
            email: 'robert.j@parent.com',
            phone: '+1-555-0103',
            occupation: 'Software Engineer',
            children: [
                { id: 's1', name: 'Alice Johnson', class: '10-A', rollNo: '2024-101' },
                { id: 's5', name: 'Emma Johnson', class: '8-A', rollNo: '2024-105' }
            ],
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robertjohnson'
        },
        {
            id: 'p2',
            name: 'Mary Wilson',
            email: 'mary.w@parent.com',
            phone: '+1-555-0104',
            occupation: 'Doctor',
            children: [
                { id: 's2', name: 'Bob Wilson', class: '10-A', rollNo: '2024-102' }
            ],
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marywilson'
        },
    ],

    // ============ CLASSES ============
    classes: [
        {
            id: 'c1',
            name: '10-A',
            grade: '10',
            section: 'A',
            classTeacher: 'John Smith',
            classTeacherId: 't1',
            totalStudents: 35,
            subjects: ['Mathematics', 'Science', 'English', 'History', 'Computer Science']
        },
        {
            id: 'c2',
            name: '10-B',
            grade: '10',
            section: 'B',
            classTeacher: 'Emily Rodriguez',
            classTeacherId: 't4',
            totalStudents: 32,
            subjects: ['Mathematics', 'Science', 'English', 'History', 'Computer Science']
        },
        {
            id: 'c3',
            name: '9-A',
            grade: '9',
            section: 'A',
            classTeacher: 'Michael Chen',
            classTeacherId: 't3',
            totalStudents: 30,
            subjects: ['Mathematics', 'Science', 'English', 'History']
        },
        {
            id: 'c4',
            name: '9-B',
            grade: '9',
            section: 'B',
            classTeacher: 'Sarah Davis',
            classTeacherId: 't2',
            totalStudents: 28,
            subjects: ['Mathematics', 'Science', 'English', 'History']
        },
        {
            id: 'c5',
            name: '8-A',
            grade: '8',
            section: 'A',
            classTeacher: 'Sarah Davis',
            classTeacherId: 't2',
            totalStudents: 33,
            subjects: ['Mathematics', 'Science', 'English', 'Social Studies']
        },
    ],

    // ============ SUBJECTS ============
    subjects: [
        { id: 'sub1', name: 'Mathematics', code: 'MATH', teacher: 'John Smith', teacherId: 't1' },
        { id: 'sub2', name: 'Science', code: 'SCI', teacher: 'Sarah Davis', teacherId: 't2' },
        { id: 'sub3', name: 'English', code: 'ENG', teacher: 'Michael Chen', teacherId: 't3' },
        { id: 'sub4', name: 'History', code: 'HIST', teacher: 'Emily Rodriguez', teacherId: 't4' },
        { id: 'sub5', name: 'Computer Science', code: 'CS', teacher: 'John Smith', teacherId: 't1' },
    ],

    // ============ CIRCULARS ============
    circulars: [
        {
            id: 'cir1',
            title: 'Winter Vacation Notice',
            date: '2025-12-20',
            category: 'Holiday',
            priority: 'high',
            content: 'School will be closed for winter vacations from December 24, 2025 to January 5, 2026. Classes will resume on January 6, 2026.',
            issuedBy: 'Principal Office'
        },
        {
            id: 'cir2',
            title: 'Annual Sports Day',
            date: '2026-02-15',
            category: 'Event',
            priority: 'medium',
            content: 'The annual sports day will be held on February 20, 2026 at the main stadium. All students are encouraged to participate.',
            issuedBy: 'Sports Department'
        },
        {
            id: 'cir3',
            title: 'Parent-Teacher Meeting',
            date: '2026-01-15',
            category: 'Meeting',
            priority: 'high',
            content: 'Parent-Teacher meeting scheduled for January 20, 2026 from 2:00 PM to 5:00 PM. All parents are requested to attend.',
            issuedBy: 'Principal Office'
        },
    ],

    // ============ EXAMS ============
    exams: [
        {
            id: 'ex1',
            title: 'Mid-Term Exam',
            subject: 'Mathematics',
            class: '10-A',
            date: '2026-03-10',
            time: '09:00 AM',
            duration: '3 Hours',
            totalMarks: 100,
            venue: 'Hall A'
        },
        {
            id: 'ex2',
            title: 'Mid-Term Exam',
            subject: 'Science',
            class: '10-A',
            date: '2026-03-12',
            time: '10:00 AM',
            duration: '3 Hours',
            totalMarks: 100,
            venue: 'Hall B'
        },
        {
            id: 'ex3',
            title: 'Mid-Term Exam',
            subject: 'English',
            class: '10-A',
            date: '2026-03-14',
            time: '09:00 AM',
            duration: '3 Hours',
            totalMarks: 100,
            venue: 'Hall A'
        },
    ],

    // ============ ATTENDANCE ============
    attendanceSummary: {
        totalStudents: 158,
        presentToday: 148,
        absentToday: 10,
        percentage: 93.7,
        date: new Date().toISOString().split('T')[0]
    },

    // ============ DASHBOARD STATS ============
    dashboardStats: {
        admin: {
            totalStudents: 158,
            totalTeachers: 24,
            totalClasses: 12,
            totalRevenue: 450000,
            attendanceRate: 93.7,
            pendingFees: 45000,
            upcomingExams: 8,
            recentCirculars: 3
        },
        teacher: {
            totalClasses: 3,
            totalStudents: 93,
            assignmentsPending: 12,
            assignmentsGraded: 45,
            attendanceRate: 94.2,
            upcomingExams: 2
        },
        student: {
            attendanceRate: 95,
            pendingAssignments: 3,
            upcomingExams: 3,
            overallGrade: 'A',
            gpa: 3.8
        },
        parent: {
            totalChildren: 2,
            pendingFees: 0,
            upcomingMeetings: 1,
            recentCirculars: 3
        }
    },

    // ============ ASSIGNMENTS ============
    assignments: [
        {
            id: 'a1',
            title: 'Quadratic Equations Problem Set',
            subject: 'Mathematics',
            class: '10-A',
            teacher: 'John Smith',
            teacherId: 't1',
            assignedDate: '2026-01-05',
            dueDate: '2026-01-15',
            totalMarks: 20,
            description: 'Solve all problems from Chapter 4. Show your work.',
            status: 'pending',
            submissions: 28,
            totalStudents: 35
        },
        {
            id: 'a2',
            title: 'Chemical Reactions Lab Report',
            subject: 'Science',
            class: '10-A',
            teacher: 'Sarah Davis',
            teacherId: 't2',
            assignedDate: '2026-01-08',
            dueDate: '2026-01-18',
            totalMarks: 30,
            description: 'Write a detailed lab report on the chemical reactions experiment.',
            status: 'pending',
            submissions: 22,
            totalStudents: 35
        },
    ],

    // ============ FEES ============
    fees: [
        {
            id: 'f1',
            studentId: 's1',
            studentName: 'Alice Johnson',
            class: '10-A',
            term: 'Term 1',
            amount: 15000,
            dueDate: '2026-01-31',
            status: 'paid',
            paidDate: '2026-01-10',
            receiptNo: 'REC-2026-001'
        },
        {
            id: 'f2',
            studentId: 's2',
            studentName: 'Bob Wilson',
            class: '10-A',
            term: 'Term 1',
            amount: 15000,
            dueDate: '2026-01-31',
            status: 'pending',
            paidDate: null,
            receiptNo: null
        },
    ],

    // ============ TIMETABLE ============
    timetable: {
        '10-A': [
            {
                day: 'Monday', periods: [
                    { period: 1, time: '08:00-09:00', subject: 'Mathematics', teacher: 'John Smith' },
                    { period: 2, time: '09:00-10:00', subject: 'Science', teacher: 'Sarah Davis' },
                    { period: 3, time: '10:15-11:15', subject: 'English', teacher: 'Michael Chen' },
                    { period: 4, time: '11:15-12:15', subject: 'History', teacher: 'Emily Rodriguez' },
                    { period: 5, time: '13:00-14:00', subject: 'Computer Science', teacher: 'John Smith' },
                ]
            },
            {
                day: 'Tuesday', periods: [
                    { period: 1, time: '08:00-09:00', subject: 'Science', teacher: 'Sarah Davis' },
                    { period: 2, time: '09:00-10:00', subject: 'Mathematics', teacher: 'John Smith' },
                    { period: 3, time: '10:15-11:15', subject: 'History', teacher: 'Emily Rodriguez' },
                    { period: 4, time: '11:15-12:15', subject: 'English', teacher: 'Michael Chen' },
                    { period: 5, time: '13:00-14:00', subject: 'Physical Education', teacher: 'Coach Williams' },
                ]
            },
            {
                day: 'Wednesday', periods: [
                    { period: 1, time: '08:00-09:00', subject: 'English', teacher: 'Michael Chen' },
                    { period: 2, time: '09:00-10:00', subject: 'Mathematics', teacher: 'John Smith' },
                    { period: 3, time: '10:15-11:15', subject: 'Science', teacher: 'Sarah Davis' },
                    { period: 4, time: '11:15-12:15', subject: 'Computer Science', teacher: 'John Smith' },
                    { period: 5, time: '13:00-14:00', subject: 'History', teacher: 'Emily Rodriguez' },
                ]
            },
            {
                day: 'Thursday', periods: [
                    { period: 1, time: '08:00-09:00', subject: 'Mathematics', teacher: 'John Smith' },
                    { period: 2, time: '09:00-10:00', subject: 'Science', teacher: 'Sarah Davis' },
                    { period: 3, time: '10:15-11:15', subject: 'Computer Science', teacher: 'John Smith' },
                    { period: 4, time: '11:15-12:15', subject: 'English', teacher: 'Michael Chen' },
                    { period: 5, time: '13:00-14:00', subject: 'Art', teacher: 'Ms. Roberts' },
                ]
            },
            {
                day: 'Friday', periods: [
                    { period: 1, time: '08:00-09:00', subject: 'Science', teacher: 'Sarah Davis' },
                    { period: 2, time: '09:00-10:00', subject: 'English', teacher: 'Michael Chen' },
                    { period: 3, time: '10:15-11:15', subject: 'Mathematics', teacher: 'John Smith' },
                    { period: 4, time: '11:15-12:15', subject: 'History', teacher: 'Emily Rodriguez' },
                    { period: 5, time: '13:00-14:00', subject: 'Library', teacher: 'Librarian' },
                ]
            },
        ]
    },

    // ============ GRADES ============
    grades: {
        's1': {
            term1: [
                { subject: 'Mathematics', marks: 85, maxMarks: 100, grade: 'A' },
                { subject: 'Science', marks: 78, maxMarks: 100, grade: 'B+' },
                { subject: 'English', marks: 92, maxMarks: 100, grade: 'A+' },
                { subject: 'History', marks: 88, maxMarks: 100, grade: 'A' },
                { subject: 'Computer Science', marks: 95, maxMarks: 100, grade: 'A+' },
            ],
            gpa: 3.8
        }
    }
};

/**
 * Helper to simulate API delay
 */
export const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
