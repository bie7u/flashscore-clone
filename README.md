# Flashscore Clone

A modern Flashscore clone application built with React and Node.js featuring real-time match updates, live scores, and comprehensive match management.

## Features

### Frontend (React + TypeScript)
- 🏠 **Responsive Design**: Modern, mobile-first UI with CSS Grid/Flexbox
- ⚽ **Real-time Updates**: Live score updates via WebSocket connections
- 🎯 **Match Management**: View live matches, fixtures, and results
- 🔄 **State Management**: Custom hooks for efficient data management
- 📱 **Routing**: React Router for seamless navigation
- 🎨 **Modern Styling**: Clean, professional design with smooth animations

### Backend (Node.js + Express + TypeScript)
- 🚀 **RESTful API**: Comprehensive endpoints for match data
- 📊 **MongoDB Integration**: Robust data persistence with Mongoose
- 🔌 **WebSocket Support**: Real-time bidirectional communication
- 🛡️ **Type Safety**: Full TypeScript implementation
- 🔧 **Middleware Support**: CORS, JSON parsing, error handling

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Socket.IO Client** for real-time updates
- **Axios** for API calls
- **CSS3** with modern styling

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **Socket.IO** for WebSocket communication
- **CORS** for cross-origin requests

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flashscore-clone
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   
   **Backend** - Copy `.env.example` to `.env` in the backend folder:
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Update the `.env` file with your settings:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/flashscore
   CLIENT_URL=http://localhost:3000
   ```

   **Frontend** - Copy `.env.example` to `.env` in the frontend folder:
   ```bash
   cd ../frontend
   cp .env.example .env
   ```

4. **Start MongoDB**
   - For local MongoDB: `mongod`
   - For MongoDB Atlas: Update the `MONGODB_URI` in backend `.env`

5. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

6. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend development server on `http://localhost:3000`

## Project Structure

```
flashscore-clone/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Header/      # Navigation header
│   │   │   ├── MatchCard/   # Individual match display
│   │   │   └── MatchList/   # Match listing component
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API and WebSocket services
│   │   ├── styles/          # Global styles
│   │   └── types/           # TypeScript type definitions
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── models/          # MongoDB/Mongoose models
│   │   ├── routes/          # Express route handlers
│   │   ├── websockets/      # Socket.IO configuration
│   │   ├── scripts/         # Utility scripts
│   │   └── server.ts        # Main server file
│   └── package.json
└── package.json             # Root package.json (monorepo)
```

## API Endpoints

### Matches
- `GET /api/matches` - Get all matches (with optional filters)
- `GET /api/matches/:id` - Get specific match
- `POST /api/matches` - Create new match
- `PUT /api/matches/:id` - Update match
- `DELETE /api/matches/:id` - Delete match
- `POST /api/matches/:id/events` - Add event to match

### Health Check
- `GET /api/health` - API health status

## WebSocket Events

### Client → Server
- `joinMatch` - Join a specific match room
- `leaveMatch` - Leave a specific match room

### Server → Client
- `matchCreated` - New match created
- `matchUpdated` - Match data updated
- `matchDeleted` - Match deleted
- `matchEvent` - New match event (goal, card, etc.)
- `scoreUpdated` - Live score update
- `statusChanged` - Match status change

## Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run seed` - Seed database with sample data
- `npm run install:all` - Install dependencies for both frontend and backend

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Backend
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed database with sample matches

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Features Roadmap

- [ ] User authentication and authorization
- [ ] Team and player management
- [ ] Advanced statistics and analytics
- [ ] Mobile app development
- [ ] Push notifications
- [ ] Match predictions
- [ ] Social features (comments, sharing)

## Support

For support, email support@flashscore-clone.com or create an issue in the repository.
