import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';
import Card from '../components/common/Card';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    setLoading(true);
    try {
      const user = await register(formData.email, formData.password, formData.role);
      toast.success('Registration successful! Please check your email to verify your account.');
      
      // Redirect based on role
      if (user.role === 'employer') {
        navigate('/employer/profile');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join JobMatchAI and find your perfect match
          </p>
        </div>

        <Card>
          <RegisterForm onSubmit={handleRegister} loading={loading} />
        </Card>
      </div>
    </div>
  );
};

export default Register;
