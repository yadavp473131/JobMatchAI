import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import Card from '../components/common/Card';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      toast.success('Login successful!');
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'employer') {
        navigate('/');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your JobMatchAI account
          </p>
        </div>

        <Card>
          <LoginForm onSubmit={handleLogin} loading={loading} />
        </Card>
      </div>
    </div>
  );
};

export default Login;
