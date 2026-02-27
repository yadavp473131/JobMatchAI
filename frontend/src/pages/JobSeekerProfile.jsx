import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProfileForm from '../components/jobseeker/ProfileForm';
import ResumeUpload from '../components/jobseeker/ResumeUpload';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';

const JobSeekerProfile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/jobseekers/profile');
      // Backend returns: { success: true, data: { profile: {...} } }
      const profileData = response.data.data?.profile || response.data.profile || response.data;
      setProfile(profileData);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Failed to load profile');
      }
      // Set profile to null on 404 so form shows empty
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (profile) {
        const response = await api.put('/jobseekers/profile', formData);
        const profileData = response.data.data?.profile || response.data.profile || response.data;
        setProfile(profileData);
        toast.success('Profile updated successfully');
      } else {
        const response = await api.post('/jobseekers/profile', formData);
        const profileData = response.data.data?.profile || response.data.profile || response.data;
        setProfile(profileData);
        toast.success('Profile created successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post('/upload/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    await fetchProfile();
    return response.data;
  };

  const handleResumeDelete = async () => {
    await api.delete('/upload/resume');
    await fetchProfile();
  };

  const handleResumeParse = async () => {
    if (!profile?.resume) {
      toast.error('Please upload a resume first');
      return;
    }

    const response = await api.post('/resume-parser/parse');
    const parsedData = response.data;

    // Auto-fill form with parsed data
    setProfile((prev) => ({
      ...prev,
      ...parsedData,
      skills: [...new Set([...(prev.skills || []), ...(parsedData.skills || [])])],
      experience: [...(prev.experience || []), ...(parsedData.experience || [])],
      education: [...(prev.education || []), ...(parsedData.education || [])],
    }));

    toast.success('Resume parsed! Review and save the information.');
  };

  const calculateCompleteness = () => {
    if (!profile) return 0;
    
    let score = 0;
    const weights = {
      firstName: 10,
      lastName: 10,
      phone: 5,
      location: 10,
      skills: 20,
      experience: 20,
      education: 15,
      resume: 10,
    };

    if (profile.firstName) score += weights.firstName;
    if (profile.lastName) score += weights.lastName;
    if (profile.phone) score += weights.phone;
    if (profile.location?.city) score += weights.location;
    if (profile.skills?.length > 0) score += weights.skills;
    if (profile.experience?.length > 0) score += weights.experience;
    if (profile.education?.length > 0) score += weights.education;
    if (profile.resume) score += weights.resume;

    return score;
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

  const completeness = calculateCompleteness();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={logout} />
      
      <div className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-2 text-sm text-gray-600">
              Complete your profile to get better job recommendations
            </p>
          </div>

        {/* Profile Completeness */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Profile Completeness
            </span>
            <span className="text-sm font-medium text-gray-900">
              {completeness}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </Card>

        {/* Resume Upload */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resume</h2>
          <ResumeUpload
            currentResume={profile?.resume}
            onUpload={handleResumeUpload}
            onDelete={handleResumeDelete}
            onParse={handleResumeParse}
          />
        </Card>

        {/* Profile Form */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Profile Information
          </h2>
          <ProfileForm
            initialData={profile || {}}
            onSubmit={handleSubmit}
            loading={saving}
          />
        </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default JobSeekerProfile;
