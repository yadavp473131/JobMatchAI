# Authentication System Documentation

## Overview

Phase 18 implements a complete authentication system for the JobMatchAI platform with JWT-based authentication, role-based access control, and password reset functionality.

## Components Created

### 1. AuthContext (`src/context/AuthContext.jsx`)
- Manages global authentication state
- Provides login, register, logout functions
- Stores user data and JWT token in localStorage
- Automatically sets Authorization header for API requests

### 2. API Service (`src/services/api.js`)
- Axios instance with interceptors
- Automatically adds JWT token to requests
- Handles authentication errors (401, 403)
- Displays toast notifications for errors
- Redirects to login on session expiration

### 3. Authentication Components

#### LoginForm (`src/components/auth/LoginForm.jsx`)
- Email and password inputs with validation
- Link to registration and password reset
- Loading state during submission

#### RegisterForm (`src/components/auth/RegisterForm.jsx`)
- Email, password, confirm password inputs
- Role selection (Job Seeker / Employer)
- Form validation with error messages

#### ProtectedRoute (`src/components/auth/ProtectedRoute.jsx`)
- Protects routes requiring authentication
- Supports role-based access control
- Shows 403 page for unauthorized access
- Redirects to login if not authenticated

### 4. Pages

#### Login (`src/pages/Login.jsx`)
- Login page with form
- Redirects to dashboard after successful login
- Role-based redirect (admin/employer/jobseeker)

#### Register (`src/pages/Register.jsx`)
- Registration page with form
- Redirects to profile page after registration
- Shows email verification message

#### ForgotPassword (`src/pages/ForgotPassword.jsx`)
- Request password reset link
- Shows confirmation after email sent

#### ResetPassword (`src/pages/ResetPassword.jsx`)
- Reset password with token from email
- Validates token and shows error if invalid
- Redirects to login after successful reset

## Usage

### Using AuthContext

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();

  // Check if user is logged in
  if (isAuthenticated) {
    console.log('User:', user);
  }

  // Login
  const handleLogin = async () => {
    try {
      await login('email@example.com', 'password');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
  };
}
```

### Protecting Routes

```jsx
import ProtectedRoute from './components/auth/ProtectedRoute';

// Protect route for authenticated users
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

// Protect route for specific roles
<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

### Making API Calls

```jsx
import api from '../services/api';

// API calls automatically include JWT token
const fetchData = async () => {
  try {
    const response = await api.get('/jobs');
    console.log(response.data);
  } catch (error) {
    // Error handling is automatic via interceptors
    console.error(error);
  }
};
```

## Authentication Flow

### Registration Flow
1. User fills registration form
2. Form validates input (email format, password length, matching passwords)
3. API call to `/api/auth/register`
4. JWT token and user data stored in localStorage
5. User redirected to profile page
6. Email verification sent (backend handles this)

### Login Flow
1. User fills login form
2. Form validates input
3. API call to `/api/auth/login`
4. JWT token and user data stored in localStorage
5. Authorization header set for future requests
6. User redirected based on role:
   - Admin → `/admin/dashboard`
   - Employer → `/employer/dashboard`
   - Job Seeker → `/dashboard`

### Password Reset Flow
1. User clicks "Forgot Password" on login page
2. Enters email address
3. API call to `/api/auth/forgot-password`
4. Email sent with reset link containing token
5. User clicks link in email
6. Redirected to `/reset-password?token=...`
7. Enters new password
8. API call to `/api/auth/reset-password/:token`
9. Password updated, user redirected to login

### Session Management
- JWT token stored in localStorage
- Token automatically added to all API requests via interceptor
- On 401 error (unauthorized):
  - Token cleared from localStorage
  - User redirected to login page
  - Toast notification shown

## Security Features

1. **Password Validation**: Minimum 6 characters
2. **Email Validation**: Proper email format required
3. **JWT Authentication**: Secure token-based authentication
4. **Role-Based Access Control**: Routes protected by user role
5. **Automatic Token Refresh**: Handled by backend
6. **Session Expiration**: Automatic logout on token expiration
7. **Password Hashing**: Handled by backend (bcrypt)

## Error Handling

The API service automatically handles common errors:

- **401 Unauthorized**: Session expired, redirect to login
- **403 Forbidden**: No permission, show error message
- **404 Not Found**: Resource not found
- **500 Server Error**: Server error, show error message
- **Network Error**: Connection issue, show error message

All errors display toast notifications to the user.

## Testing

To test the authentication system:

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm start
   ```

3. Navigate to `http://localhost:3000`

4. Test registration:
   - Go to `/register`
   - Fill form with valid data
   - Submit and verify redirect

5. Test login:
   - Go to `/login`
   - Enter credentials
   - Verify redirect to dashboard

6. Test password reset:
   - Go to `/forgot-password`
   - Enter email
   - Check email for reset link
   - Click link and reset password

## Next Steps

Future phases will add:
- Email verification page
- User profile pages
- Dashboard pages for each role
- Additional protected routes
- Remember me functionality
- Social authentication (Google, LinkedIn)
