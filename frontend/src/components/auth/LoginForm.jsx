import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';

const LoginForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="Enter your email"
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        placeholder="Enter your password"
      />

      <div className="flex items-center justify-between">
        <Link
          to="/forgot-password"
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
      >
        Sign In
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
