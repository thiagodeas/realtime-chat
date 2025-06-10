# Realtime Chat Application

This project is a simple realtime chat application built with React, TypeScript, Vite, Express, and Socket.IO.

## Project Structure

- `client/`: React + TypeScript frontend using Vite and TailwindCSS.
- `server/`: Node.js backend using Express and Socket.IO.

## Features

- Realtime messaging between users.
- System notifications when users join or leave the chat.
- User typing notifications ("Usuário está digitando...") in realtime.
- Responsive UI.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. **Clone the repository:**

   ```sh
   git clone <https://github.com/thiagodeas/realtime-chat.git>
   cd realtime-chat
   ```

2. **Install dependencies:**
   ```sh
   cd server
   npm install
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the server:**

   ```sh
   cd server
   npm run dev
   ```

2. **Start the client:**

   ```sh
   cd client
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

- Enter your message and click "Enviar" to send.
- All messages are broadcast to connected users in realtime.
- System messages notify when users join or leave.
- When a user is typing, others see a "Usuário está digitando..." notification.

## Technologies Used

- React
- TypeScript
- Vite
- TailwindCSS
- Express
- Socket.IO
