import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import EmployerProfileForm from '../components/employer/EmployerProfileForm';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';

const EmployerProfile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/employers/profile');
      setProfile(response.data.data?.profile || null);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (file) => {
    const formData = new FormData();
    formData.append('logo', file);

    try {
      await api.post('/upload/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Logo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload logo');
      throw error;
    }
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (profile) {
        const response = await api.put('/employers/profile', formData);
        setProfile(response.data.data?.profile || null);
        toast.success('Profile updated successfully');
      } else {
        const response = await api.post('/employers/profile', formData);
        setProfile(response.data.data?.profile || null);
        toast.success('Profile created successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={logout} />
        <div className="flex-1 flex items-center justify-center">
          <Loader text="Loading profile..." />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={logout} />
      
      <div className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your company information and attract top talent
            </p>
          </div>

          <Card>
            <EmployerProfileForm
              initialData={profile || {}}
              onSubmit={handleSubmit}
              onLogoUpload={handleLogoUpload}
              loading={saving}
            />
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EmployerProfile;
