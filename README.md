# Clinimood-MERN-frontend

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fclinimood-mern-frontend.vercel.app)](https://clinimood-mern-frontend.vercel.app/)

Clinimood is a web application built using the MERN stack (MongoDB, Express, React, and Node.js) designed to streamline medical appointment management. This platform allows patients to schedule appointments with doctors, manage their personal information, and receive reminders for upcoming consultations.

## Key Features

- **User Registration & Authentication:** Secure account creation and login system.
- **Appointment Manager:** Schedule, reschedule, and cancel medical appointments with ease.
- **Notifications & Reminders:** Alerts and reminders to keep track of upcoming appointments.
- **User Profile Management:** Patients can update their personal and medical information.
- **Responsive & Intuitive UI:** Optimized design for both mobile and desktop devices.

## Technologies Used

- **Frontend:**
    - React.js with Vite for fast and efficient rendering.
    - SCSS for structured and modern styling.
    - React Router for seamless navigation.
    - Axios for handling API requests.
- **Backend:**
    - Node.js with Express.js for server-side logic.
    - MongoDB as the NoSQL database.
    - JSON Web Tokens (JWT) for secure authentication.
    - Nodemailer for sending email notifications.

## Installation & Setup

Follow these steps to run the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/c0d3sh0rt4g3/Clinimood-MERN-frontend.git
   cd Clinimood-MERN-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   Ensure that the API URL points to the appropriate backend server.

4. **Run the application:**

   ```bash
   npm run dev
   ```

   The application will be accessible at `http://localhost:5173`.

## How to Use the Application

1. **Sign Up/Login:** Create an account or log in using valid credentials.
2. **Schedule an Appointment:** Select a doctor, choose a date, and confirm your appointment.
3. **Receive Notifications:** Get alerts and reminders for upcoming appointments.
4. **Manage Appointment History:** View past and upcoming appointments from your profile.



