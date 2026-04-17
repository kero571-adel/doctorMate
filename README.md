# 🏥 DoctorMate Doctor Dashboard

> **A Professional Web Dashboard for Healthcare Professionals**
>
> Manage appointments, communicate with patients, and conduct teleconsultations seamlessly with real-time technologies.

[![React](https://img.shields.io/badge/React-18.x-blue?logo=react)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Real--time-orange?logo=firebase)](https://firebase.google.com)
[![Agora](https://img.shields.io/badge/Agora-RTC-purple?logo=agora)](https://www.agora.io)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Demo](#-demo)
- [Key Features](#-key-features)
- [Communication & Telemedicine](#-communication--telemedicine)
- [Architecture & Project Structure](#-architecture--project-structure)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [UI/UX Design](#-uiux-design)
- [License](#-license)
- [Team](#-team)

---

## 🚀 Project Overview

**DoctorMate Doctor Dashboard** is a comprehensive web application designed specifically for healthcare professionals. It's part of the DoctorMate healthcare ecosystem that connects doctors with patients through an integrated platform.

### Key Capabilities:

- 👨‍⚕️ Manage patient profiles and medical history
- 📅 Handle appointment scheduling and tracking
- 💬 Real-time chat with patients
- 🎥 Conduct secure video consultations
- 🔔 Receive instant notifications for appointments and messages
- 📱 Responsive design for desktop and tablet access,mobile

---

## 🎬 Demo

### 📺 Live Demo

[Visit Live Dashboard](https://doctor-mate.vercel.app)

### 🎥 Video Demo

[Watch Demo Video](https://drive.google.com/drive/folders/1RPl_hXdpCpJS6VFwO2kE50XCY9A3lf9_?usp=sharing)

## 📸 Screenshots

| | | | |
|---|---|---|---|
| ![](public/imageRedme/Screenshot%202026-04-17%20151731.png) | ![](public/imageRedme/Screenshot%202026-04-17%20151854.png) | ![](public/imageRedme/Screenshot%202026-04-17%20152847.png) | ![](public/imageRedme/Screenshot%202026-04-17%20152017.png) |

---

| | | | |
|---|---|---|---|
| ![](public/imageRedme/Screenshot%202026-04-17%20152042.png) | ![](public/imageRedme/Screenshot%202026-04-08%20222331.png) | ![](public/imageRedme/Screenshot%202026-04-17%20152137.png) | ![](public/imageRedme/Screenshot%202026-04-17%20153245.png) |

---

| | | | |
|---|---|---|---|
| ![](public/imageRedme/Screenshot%202026-04-17%20153315.png) | ![](public/imageRedme/Screenshot%202026-04-08%20224128.png) | ![](public/imageRedme/Screenshot%202026-04-08%20224204.png) | ![](public/imageRedme/Screenshot%202026-04-08%20224229.png) |

---

| | | | |
|---|---|---|---|
| ![](public/imageRedme/Screenshot%202026-04-17%20152244.png) | ![](public/imageRedme/Screenshot%202026-04-08%20224252.png) | ![](public/imageRedme/Screenshot%202026-04-08%20224204.png) | ![](public/imageRedme/Screenshot%202026-04-08%20224229.png) |

## ✨ Key Features

### 🔐 Authentication & Security

- **Secure Login/Registration** - Email and password-based authentication via Firebase Auth
- **Role-Based Access Control** - Dedicated doctor-specific features and restrictions
- **Session Management** - Auto-logout and session timeout for security
- **HIPAA Compliance** - Adherence to healthcare data protection standards

### 👥 Dashboard & Patient Management

- **Patient Directory** - View all patients with search and filter capabilities
- **Patient Profiles** - Comprehensive patient information including medical history
- **Medical Records** - Secure storage and access to patient documents
- **Patient Analytics** - Track consultation frequency and patient health trends
- **Quick Actions** - Fast access to schedule appointments or start consultations

### 📅 Appointment Management

- **Schedule Appointments** - Create and manage patient appointments
- **Calendar View** - Visual representation of daily and weekly schedules
- **Appointment Reminders** - Automated notifications for upcoming consultations
- **Reschedule/Cancel** - Flexible appointment modification options
- **Appointment History** - Track past consultations and follow-ups
- **Availability Settings** - Define working hours and break times

### 💬 Real-time Chat (Firebase Firestore)

- **Instant Messaging** - Send and receive messages in real-time
- **Typing Indicators** - See when patients are typing
- **Message History** - Access complete chat conversation history
- **File Sharing** - Share medical documents and prescriptions
- **Chat Notifications** - Push notifications for new messages
- **Message Search** - Search through past conversations

### 🎥 Voice & Video Calls (Agora RTC)

- **HD Video Calls** - Crystal clear 1080p video consultations
- **Audio-Only Mode** - Switch to audio-only for bandwidth optimization
- **Call Quality Indicators** - Monitor connection quality in real-time
- **Automatic Fallback** - Graceful degradation for poor connections

### 🔔 Notifications (Firebase Cloud Messaging)

- **Appointment Alerts** - Reminders for upcoming consultations
- **Message Notifications** - Alert for new patient messages
- **Missed Call Alerts** - Notify when patients initiate calls
- **System Notifications** - Important platform updates and alerts
- **Customizable Preferences** - Configure notification settings

### 📋 Medical Records

- **Prescription Management** - Create and send digital prescriptions
- **Document Storage** - Secure cloud storage for patient documents
- **Lab Results** - View and share laboratory test results
- **Diagnosis History** - Maintain detailed diagnosis records
- **Report Generation** - Export consultation reports in PDF format

---

## 📞 Communication & Telemedicine

### Agora Real-time Communication Engine

The dashboard leverages **Agora Real-Time Communication (RTC)** platform to deliver:

- **Ultra-Low Latency** - Sub-100ms video and audio transmission
- **Global Network** - 200+ data centers worldwide for optimal routing
- **High Reliability** - 99.99% uptime SLA for critical healthcare communications
- **Scalability** - Support for thousands of concurrent consultations

### Microphone & Camera Controls

- 🎙️ **Mic Control** - Mute/unmute with instant visual feedback
- 📹 **Camera Control** - Enable/disable video with quality presets
- 🔊 **Audio Settings** - Speaker and microphone selection
- 🎚️ **Volume Control** - Adjust speaker and microphone volume
- 🎛️ **Audio Enhancement** - Noise cancellation and echo reduction options

---

## 🏗️ Architecture & Project Structure

### React Architecture Highlights

- **Functional Components** - React Hooks for state management and side effects
- **Custom Hooks** - Reusable logic hooks ( useCommunicationSession.js)
- **Context API** - Global state for user data and app settings
- **Redux Toolkit** - Centralized state management for complex operations
- **Service Layer** - Abstracted API calls and Firebase operations
- **Error Boundaries** - Graceful error handling and recovery

### Project Folder Structure

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── Dashboard.jsx
│   │   ├── DashboardHeader.jsx
│   │   └── StatCards.jsx
│   ├── Patients/
│   │   ├── PatientList.jsx
│   │   ├── PatientCard.jsx
│   │   └── PatientDetail.jsx
│   ├── Appointments/
│   │   ├── AppointmentCalendar.jsx
│   │   ├── AppointmentForm.jsx
│   │   └── AppointmentList.jsx
│   ├── Chat/
│   │   ├── ChatWindow.jsx
│   │   ├── ChatMessage.jsx
│   │   └── ChatInput.jsx
│   ├── VideoCall/
│   │   ├── VideoCallRoom.jsx
│   │   ├── VideoControls.jsx
│   │   └── ParticipantVideo.jsx
│   ├── Layout/
│   │   ├── Sidebar.jsx
│   │   ├── Navbar.jsx
│   │   └── Layout.jsx
│   └── Common/
│       ├── Button.jsx
│       ├── Modal.jsx
│       └── LoadingSpinner.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── PatientsPage.jsx
│   ├── AppointmentsPage.jsx
│   ├── ChatPage.jsx
│   ├── VideoCallPage.jsx
│   └── NotFoundPage.jsx
├── services/
│   ├── firebase.js
│   ├── authService.js
│   ├── patientService.js
│   ├── appointmentService.js
│   ├── chatService.js
│   ├── videoCallService.js
│   └── notificationService.js
├── hooks/
│   ├── useAuth.js
│   ├── useChat.js
│   ├── useAppointments.js
│   ├── useVideoCall.js
│   └── useFetch.js
├── redux/
│   ├── store.js
│   ├── slices/
│   │   ├── authSlice.js
│   │   ├── appointmentSlice.js
│   │   ├── chatSlice.js
│   │   └── uiSlice.js
│   └── middleware/
│       └── thunks.js
├── utils/
│   ├── constants.js
│   ├── helpers.js
│   ├── validators.js
│   ├── dateFormatter.js
│   └── errorHandler.js
├── styles/
│   ├── global.css
│   ├── variables.css
│   └── theme.js
├── App.jsx
└── main.jsx

public/
├── index.html
└── assets/

.env (for environment variables)
package.json
vite.config.js
```

---

## 🛠️ Tech Stack

| Category               | Technology                 |
| ---------------------- | -------------------------- |
| **Frontend Framework** | React 18.x                 |
| **Build Tool**         | Vite                       |
| **State Management**   | Redux Toolkit, Context API |
| **UI Library**         | Material-UI (MUI)          |
| **Styling**            | CSS-in-JS, Tailwind CSS    |
| **HTTP Client**        | Axios                      |
| **Real-time Chat**     | Firebase Firestore         |
| **Video Calling**      | Agora RTC SDK              |
| **Push Notifications** | Firebase Cloud Messaging   |
| **Routing**            | React Router v6            |
| **Form Handling**      | React Hook Form            |
| **Package Manager**    | npm                        |
| **Version Control**    | Git                        |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** - v16.x or higher
- **npm** - v8.x or higher (or yarn)
- **Git** - for version control
- **Firebase Account** - for backend services
- **Agora Account** - for video calling capabilities

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/doctormate/doctor-dashboard.git
cd doctor-dashboard
```

#### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

#### 3. Configure Environment Variables

Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables) section)

#### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

#### 5. Build for Production

```bash
npm run build
# or
yarn build
```

#### 6. Preview Production Build

```bash
npm run preview
# or
yarn preview
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Agora Configuration
VITE_AGORA_APP_ID=your_agora_app_id
VITE_AGORA_APP_CERTIFICATE=your_agora_app_certificate

# API Endpoints
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=DoctorMate Doctor Dashboard

# Feature Flags
VITE_ENABLE_VIDEO_RECORDING=true
VITE_ENABLE_SCREEN_SHARING=true
```

**Important:** Never commit `.env` file to version control. Add it to `.gitignore`.

---

## 🎨 UI/UX Design

### Design Philosophy

- **Clean & Minimalist** - Intuitive interface with minimal distractions
- **Healthcare-Focused** - Professional aesthetic suitable for medical environment
- **Dark Mode** - Optional dark theme to reduce eye strain during long sessions
- **Accessibility** - WCAG 2.1 AA compliance for all users

### Responsive Design

- **Desktop** - Full-featured experience on screens 1024px and above
- **Tablet** - Optimized layout for 768px to 1024px screens
- **Mobile** - Essential features accessible on smaller screens (limited features)

### Real-time Updates

- **Instant Messages** - Chat messages appear immediately
- **Live Notifications** - Push notifications for new appointments and messages
- **Calendar Sync** - Appointments update in real-time across all views
- **Presence Indicators** - See when patients are online and available

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**DoctorMate Team**

Developed with ❤️ for healthcare professionals and patient care.

### Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Support

For support, email support@doctormate.com or open an issue on GitHub.

### Links

- 🌐 [Website](https://doctormate.com)
- 📧 [Email](mailto:info@doctormate.com)
- 💼 [LinkedIn](https://linkedin.com/company/doctormate)

---

<div align="center">

**Made with ❤️ by DoctorMate Team**

⭐ If this project helped you, please consider giving us a star!

</div>
