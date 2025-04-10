# Full Stack Authentication Application

A modern, secure authentication system built with Next.js and FastAPI, featuring user registration, login, and profile management.

## Project Structure

```
├── app/                    # Next.js frontend application
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   └── dashboard/         # Protected dashboard page
├── backend/               # FastAPI backend application
│   ├── models.py          # Database models
│   ├── database.py        # Database configuration
│   └── main.py           # Main application logic
│   └── schemas.py         #Schemas
    └── requirements.txt   #Dependencies to be installed
```

## Frontend (Next.js)

### Technologies Used

- Next.js 13.5 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui for UI components
- React Hook Form for form management
- Zod for form validation
- Lucide React for icons

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Environment Setup

1. Clone the repository
2. Navigate to the project root directory

### Installation

```bash
# Install dependencies
npm install
```

### Running the Frontend

```bash
# Start the development server
npm run dev
```

The frontend application will be available at `http://localhost:3000`

### Frontend Features

- Modern, responsive UI with beautiful gradients
- Form validation with real-time feedback
- Protected routes with authentication
- User dashboard with profile information
- Toast notifications for user feedback
- Loading states and transitions
- Secure token management

## Backend (FastAPI)

### Technologies Used

- FastAPI for the REST API
- SQLAlchemy for ORM
- SQLite for database
- JWT for authentication
- Bcrypt for password hashing
- Python-dotenv for environment variables

### Prerequisites

- Python 3.10+ installed
- pip package manager

### Environment Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv



# On Windows
.\venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Configure environment variables:
   - Copy the `.env.example` file to `.env`
   - Update the variables as needed:

     ```
     SECRET_KEY=your-secret-key-here
     DATABASE_URL=sqlite:///./sql_app.db
     ```

### Installation

```bash
# Install required packages
pip install -r requirements.txt
```

### Running the Backend

```bash
# Start the FastAPI server
fastapi dev
#OR
uvicorn main:app --reload
```

The backend API will be available at `http://localhost:8000`

### API Documentation

Once the backend is running, you can access:
- Interactive API documentation: `http://localhost:8000/docs`
- Alternative documentation: `http://localhost:8000/redoc`

### Backend Features

- Secure JWT authentication
- Password hashing with bcrypt
- SQLite database with SQLAlchemy ORM
- Protected routes with dependency injection
- CORS middleware configuration
- User model with email and profile information
- Error handling and validation

## Testing the Application

1. Start both the frontend and backend servers
2. Visit `http://localhost:3000`
3. Register a new account
4. Log in with your credentials
5. Explore the dashboard and profile features

## Security Features

- Secure password hashing with bcrypt
- JWT token-based authentication
- Protected API endpoints
- Form validation and sanitization
- Secure token storage
- CORS protection

## Development Best Practices

- Type safety with TypeScript
- Clean code architecture
- Proper error handling
- Responsive design
- Modern component patterns
- Secure authentication flow
- Environment variable management
- Code organization and modularity

## Additional Notes

- The application uses SQLite for simplicity, but can be easily configured to use other databases
- All forms include proper validation and error handling
- The UI is fully responsive and works on all device sizes
- The project follows modern development practices and patterns

## Troubleshooting

Common issues and solutions:

1. **Backend connection refused**
   - Ensure the backend server is running on port 8000
   - Check CORS configuration in `main.py`

2. **Database errors**
   - Verify the database URL in `.env`
   - Ensure proper permissions for SQLite file creation

3. **Frontend not loading**
   - Clear browser cache
   - Check for JavaScript console errors
   - Verify all dependencies are installed

4. **Authentication issues**
   - Clear local storage
   - Check token expiration
   - Verify API endpoint URLs