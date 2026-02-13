# School Management System 🎓

A modern, comprehensive School Management System built with **React (Vite)** and **Tailwind CSS**. 

> [!NOTE]
> **Project Status**: The frontend is 100% functional and designed as a **Standalone Demo**. It uses a mock data interceptor to simulate backend responses, allowing you to explore all features right in the browser. The Node.js/MongoDB backend is currently under development and kept for learning purposes.

## 🚀 Live Demo
- **Netlify Link**: https://school-mngmnt-frontend.netlify.app/
- **Standalone Mode**: Enabled by default (No database required).

## 🌟 Key Features

### 🏢 Portals & User Roles
- **Administrator Dashboard**: Manage students, teachers, parents, classes, and subjects. View high-level school analytics.
- **Teacher Portal**: Track attendance, manage assignments, and view class timetables.
- **Student Portal**: View grades, check attendance, and access academic resources.
- **Parent Portal**: Monitor children's performance, attendance history, and school fees.

### 🛠️ Core Modules
- **Attendance Tracking**: Role-specific attendance management.
- **Exam Management**: Schedule and view examination details.
- **Fee Management**: Interactive fee status tracking.
- **Circulars & Notifications**: School-wide announcements system.
- **User Directory**: Searchable directories for students, parents, and staff.

## 💻 Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, React Hook Form, Axios.
- **Design**: Modern Glassmorphism UI, Responsive Layouts.
- **Backend (In-Progress)**: Node.js, Express.js, MongoDB.

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/school-management.git
   cd school-management
   ```

2. **Setup Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Access the Application**:
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔐 Demo Credentials (Standalone Mode)
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@school.com` | `any password` |
| **Teacher** | `teacher@school.com` | `any password` |
| **Student** | `student@school.com` | `any password` |
| **Parent** | `parent@school.com` | `any password` |

---

## 🏗️ Future Development
- Complete the Express.js and MongoDB integration.
- Implement real-time notifications with Socket.io.
- Add advanced reporting and PDF generation.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
