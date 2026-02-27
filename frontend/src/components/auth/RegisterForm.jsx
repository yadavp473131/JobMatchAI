import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';

const RegisterForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'jobseeker',
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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
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

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        placeholder="Confirm your password"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          I am a
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="jobseeker"
              checked={formData.role === 'jobseeker'}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">Job Seeker</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="employer"
              checked={formData.role === 'employer'}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">Employer</span>
          </label>
        </div>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
      >
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
