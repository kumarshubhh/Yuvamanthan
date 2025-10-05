# CrowdSolve Platform

A community-driven platform for posting and solving local problems collaboratively. Built with React, Node.js, and MongoDB.

## Features

### Level 3 Requirements ✅

- **User Authentication**: JWT-based login/signup system
- **Problem Posting**: Users can post problems with:
  - Location details (coordinates + address)
  - Multiple image uploads
  - Detailed descriptions
  - Category classification
  - Priority levels
  - Tags for better organization
- **Solution Suggestions**: Community members can propose solutions with:
  - Detailed solution descriptions
  - Estimated cost and time
  - Difficulty levels
  - Resource links
- **Voting System**: Upvote/downvote problems and solutions
- **Comments**: Discussion on solutions
- **Modern UI**: Responsive design with Tailwind CSS

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Express Validator** for input validation
- **Multer** for file uploads (ready for Cloudinary integration)

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for form handling
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons

## Project Structure

```
Yuvamanthan/
├── server.js                 # Main server file
├── package.json              # Backend dependencies
├── config.env               # Environment variables
├── models/                   # MongoDB models
│   ├── User.js
│   ├── Problem.js
│   └── Solution.js
├── routes/                   # API routes
│   ├── auth.js
│   ├── problems.js
│   └── solutions.js
├── middleware/               # Custom middleware
│   └── auth.js
└── client/                   # React frontend
    ├── src/
    │   ├── components/       # Reusable components
    │   ├── pages/           # Page components
    │   ├── contexts/        # React contexts
    │   └── App.tsx         # Main app component
    ├── package.json         # Frontend dependencies
    └── tailwind.config.js   # Tailwind configuration
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `config.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

3. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Problems
- `GET /api/problems` - Get all problems (with pagination, filtering)
- `GET /api/problems/:id` - Get single problem
- `POST /api/problems` - Create new problem
- `PUT /api/problems/:id` - Update problem
- `DELETE /api/problems/:id` - Delete problem
- `POST /api/problems/:id/vote` - Vote on problem
- `GET /api/problems/:id/solutions` - Get solutions for problem

### Solutions
- `GET /api/solutions` - Get all solutions
- `GET /api/solutions/:id` - Get single solution
- `POST /api/solutions` - Create new solution
- `PUT /api/solutions/:id` - Update solution
- `DELETE /api/solutions/:id` - Delete solution
- `POST /api/solutions/:id/vote` - Vote on solution
- `POST /api/solutions/:id/comments` - Add comment to solution
- `PUT /api/solutions/:id/accept` - Accept solution (problem author only)

## Key Features Implemented

### 1. User Authentication System
- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes and middleware
- User profile management

### 2. Problem Management
- Rich problem posting with images
- Location-based problem discovery
- Category and priority classification
- Status tracking (Open, In Progress, Resolved, Closed)
- Tagging system for better organization

### 3. Solution System
- Community-driven solution proposals
- Cost and time estimation
- Difficulty levels
- Resource links and documentation
- Solution acceptance by problem authors

### 4. Interactive Features
- Voting system for problems and solutions
- Comment system for discussions
- Real-time notifications
- User reputation system

### 5. Modern UI/UX
- Responsive design for all devices
- Intuitive navigation
- Beautiful animations and transitions
- Accessible design patterns
- Dark/light theme ready

## Database Schema

### User Model
- Personal information (name, email, bio, location)
- Authentication data (password hash)
- Profile settings

### Problem Model
- Problem details (title, description, location)
- Metadata (category, priority, status, tags)
- Media (images array)
- Social features (upvotes, downvotes)
- Author reference

### Solution Model
- Solution details (description, resources)
- Implementation info (cost, time, difficulty)
- Social features (upvotes, downvotes, comments)
- Acceptance status
- Author and problem references

## Deployment Ready

The application is ready for deployment with:
- Environment variable configuration
- Production build scripts
- MongoDB Atlas integration
- Image upload service ready (Cloudinary)
- CORS configuration for production

## Future Enhancements

- Real-time notifications
- Advanced search and filtering
- Mobile app development
- Integration with mapping services
- Community moderation tools
- Analytics dashboard
- Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
