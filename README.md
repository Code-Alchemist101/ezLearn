# Ez Learn

Ez Learn is an AI-powered mobile application designed to help users explore personalized learning paths for hobbies and games. The app uses Gemini AI to generate customized learning modules and incorporates gamification elements to enhance the learning experience. Additionally, Ez Learn integrates YouTube videos for an engaging, step-by-step approach to mastering new hobbies or games.

## Tech Stack

- **Frontend**: React Native, Expo
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI**: Gemini AI

## Features

- **AI-Generated Learning Modules**: Get personalized learning modules powered by Gemini AI, which creates a tailored learning path based on your interests and skill level.
- **XP Gamification**: Earn experience points (XP) as you progress through the modules, motivating you to complete challenges and level up your learning.
- **YouTube Video Integration**: Learn through curated YouTube videos, selected to explain key concepts and provide step-by-step guidance for various hobbies and games.

## Getting Started

Follow these steps to set up both the frontend and backend of the project locally on your machine.

### Prerequisites

Make sure you have the following installed on your machine:
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Expo CLI (for React Native development)
- MongoDB (for local database)

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/Code-Alchemist101/ezLearn.git
cd ezLearn
```

### 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Expo project:

```bash
npx expo start
```

This will start the development server and open Expo in your browser, where you can scan the QR code to view the app on your device or simulator.

### 3. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory with the following structure:

```
MONGO_URI=your_mongodb_connection_string
GEMINI_API=your_gemini_api_key
PORT=3000
```

Start the server:

```bash
npm start
```

The backend server will be running, and you can begin interacting with the API.

## Environment Variables

Make sure to set up your environment variables in the `.env` file located in the `backend` directory:

- **MONGO_URI**: Your MongoDB connection string
- **GEMINI_API**: Your Gemini AI API key
- **PORT**: Port number for the backend server (default: 3000)
