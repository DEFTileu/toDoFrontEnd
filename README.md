# TaskFlow - Professional Task Management Application

A modern, responsive task management application built with React, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Authentication System**: Login and registration with JWT tokens
- ✅ **Task Management**: Create, read, update, and delete tasks
- 👤 **User Profiles**: Manage user information and settings
- 🌍 **Multi-language Support**: English, Russian, and Kazakh
- 📱 **Responsive Design**: Mobile-first approach with beautiful UI
- 🎨 **Modern Design**: Clean interface with smooth animations
- 🔔 **Toast Notifications**: Real-time feedback for user actions

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API server running on `http://localhost:3000`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd taskflow
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your API URL:
```env
REACT_APP_API_URL=http://localhost:3000/api
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Integration

This application expects a REST API backend with the following endpoints:

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### User Management Endpoints
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password

### Task Management Endpoints
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

For detailed API documentation, visit the "API Docs" page in the application.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication forms
│   ├── common/         # Common UI components
│   ├── navigation/     # Navigation components
│   ├── profile/        # Profile-related components
│   └── tasks/          # Task-related components
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API service functions
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

- `REACT_APP_API_URL` - Backend API base URL (default: http://localhost:3000/api)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.