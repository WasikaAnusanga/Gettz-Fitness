# Gettz-Fitness Management System

A comprehensive gym and fitness management platform featuring a Node.js backend, React frontend, and Arduino-integrated RFID attendance system.

## 🚀 Overview

Gettz-Fitness is an all-in-one solution for modern fitness centers. It streamlines operations ranging from member subscriptions and workout tracking to equipment maintenance and automated attendance using RFID technology.

## ✨ Features

### 👤 User Roles
- **Admin**: Full system control, analytics, and management of all roles.
- **Trainer**: Manage workout videos, meal plans, and interact with trainees.
- **Member**: Access to video portals, meal plans, community feed, and subscription management.
- **Equipment Manager**: Track gym equipment status and maintenance logs.
- **Customer Supporter**: Handle inquiries and support tickets.

### 🛠 Core Modules
- **Subscription Management**: Multiple membership plans with Stripe payment integration.
- **RFID Attendance**: Seamless check-in/out integration using Arduino and RFID sensors.
- **Workout & Nutrition**: Video portal for training sessions and customizable meal templates.
- **Community & Gamification**: Social feed for posts, fitness challenges, and leaderboards.
- **Inventory & Maintenance**: Manage supplements sales and keep equipment maintenance logs.
- **Communication**: Automated notifications, AI ChatBot, and inquiry systems.
- **Analytics**: Dashboards for revenue, stats, and attendance records.

## 💻 Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS, Framer Motion (Animations)
- **State Management**: React Hooks
- **Icons**: Lucide React, React Icons
- **Charts**: Recharts
- **Communication**: Socket.io-client

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io
- **Hardware Integration**: SerialPort (for Arduino)
- **Authentication**: JWT, Google OAuth, Bcrypt
- **Tasks**: Node-cron (for subscription expiry)

### Hardware
- **Platform**: Arduino
- **Sensors**: RFID (RC522) for attendance tracking

## ⚙️ Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) account or local instance
- [Arduino IDE](https://www.arduino.cc/en/software) (for hardware setup)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Gettz-Fitness
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```
   Create a `.env` file in the `Backend` directory and add:
   ```env
   MONGO_URL=your_mongodb_connection_string
   JWT_KEY=your_jwt_secret
   PORT=5000
   STRIPE_SECRET_KEY=your_stripe_key
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory and add:
   ```env
   VITE_GOOGLE_LOGIN_CLIENT_ID=your_google_client_id
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. **Arduino Setup**
   - Navigate to the `Arduino/final` directory.
   - Upload `final.ino` to your Arduino board.
   - Ensure the RFID reader is wired correctly to the board.

## 🏃 Running the Application

1. **Start Backend**
   ```bash
   cd Backend
   npm start
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

## 📂 Project Structure

- `Arduino/`: Firmware for RFID scanners and data passing.
- `Backend/`: API server, models, controllers, and serial port listeners.
- `frontend/`: React application dashboard and client-facing pages.

## 📄 License
This project is licensed under the ISC License.
