# MedTrack

MedTrack is a comprehensive medication management system designed to help users track, manage, and receive reminders for their medications. The application includes prescription upload and approval workflows, medication scheduling, and separate interfaces for users and administrators.

## Project Structure

This repository contains both the frontend and backend components of the MedTrack application:

```
MedTrack/
├── backend/            # Node.js backend
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Authentication and utility middleware
│   ├── models/         # Database models
│   ├── routes/         # API route definitions
│   ├── uploads/        # Prescription file storage
│   └── server.js       # Main server entry point
│
└── src/                # React frontend
    ├── assets/         # Static assets
    ├── components/     # Reusable UI components
    ├── context/        # React context providers
    ├── pages/          # Page components
    ├── routes/         # Routing configuration
    ├── services/       # API service functions
    └── utils/          # Utility functions
```

## Features

- **User Authentication**: Secure login and registration system
- **Prescription Management**: Upload, view, and manage medical prescriptions
- **Admin Panel**: Review and approve/reject prescription uploads
- **Medication Tracking**: Add, update, and delete medication information
- **Medication Reminders**: Scheduled alerts for medication doses
- **Responsive Design**: Optimized for both desktop and mobile devices

## Technologies

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer for file uploads

### Frontend
- React.js
- Chakra UI
- React Router
- Axios for API requests
- Context API for state management

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/HimanshuRajputt/MediTrack-
   cd medtrack
   ```

2. Install dependencies for both frontend and backend:
   ```
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the backend directory with the following variables:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

4. Start the development servers:
   ```
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server (in a new terminal)
   cd ../
   npm start
   ```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login

### Prescriptions
- `POST /prescriptions` - Upload a new prescription
- `GET /prescriptions` - Get all prescriptions
- `PUT /prescriptions/:id/:status` - Update prescription status

### Medications
- `POST /medications` - Add a new medication
- `GET /medications` - Get all medications for a user
- `PUT /medications/:id` - Update medication details
- `DELETE /medications/:id` - Delete a medication

## Deployment

The application is deployed on:
- Backend: [Live](https://medtrack-backend.onrender.com)
- Frontend: [[Live ](https://thunderous-pie-a23da2.netlify.app/)]

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - [Himanshu Rajput](mailto:rajput6600himanshu@gmail.com)

Project Link: [Repo Link-](https://github.com/HimanshuRajputt/MediTrack-)
