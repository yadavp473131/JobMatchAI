import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const ProfileForm = ({ initialData = {}, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    phone: initialData.phone || '',
    location: {
      city: initialData.location?.city || '',
      state: initialData.location?.state || '',
      country: initialData.location?.country || '',
    },
    skills: initialData.skills || [],
    experience: initialData.experience || [],
    education: initialData.education || [],
    preferences: {
      jobType: initialData.preferences?.jobTypes || initialData.preferences?.jobType || [],
      desiredSalary: initialData.preferences?.desiredSalary?.min || initialData.preferences?.desiredSalary || '',
      willingToRelocate: initialData.preferences?.willingToRelocate || false,
    },
  });

  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState({});

  // Helper function to format date for month input (YYYY-MM)
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  // Update form data when initialData changes (e.g., after profile is fetched)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        phone: initialData.phone || '',
        location: {
          city: initialData.location?.city || '',
          state: initialData.location?.state || '',
          country: initialData.location?.country || '',
        },
        skills: initialData.skills || [],
        experience: (initialData.experience || []).map(exp => ({
          ...exp,
          startDate: formatDateForInput(exp.startDate),
          endDate: formatDateForInput(exp.endDate),
        })),
        education: (initialData.education || []).map(edu => ({
          ...edu,
          startDate: formatDateForInput(edu.startDate),
          endDate: formatDateForInput(edu.endDate),
        })),
        preferences: {
          jobType: initialData.preferences?.jobTypes || initialData.preferences?.jobType || [],
          desiredSalary: initialData.preferences?.desiredSalary?.min || initialData.preferences?.desiredSalary || '',
          willingToRelocate: initialData.preferences?.willingToRelocate || false,
        },
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: type === 'checkbox' ? checked : value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' },
      ],
    }));
  };

  const updateExperience = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: '', institution: '', location: '', startDate: '', endDate: '', current: false },
      ],
    }));
  };

  const updateEducation = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleJobTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        jobType: prev.preferences.jobType.includes(type)
          ? prev.preferences.jobType.filter((t) => t !== type)
          : [...prev.preferences.jobType, type],
      },
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="City"
            name="location.city"
            value={formData.location.city}
            onChange={handleChange}
          />
          <Input
            label="State"
            name="location.state"
            value={formData.location.state}
            onChange={handleChange}
          />
          <Input
            label="Country"
            name="location.country"
            value={formData.location.country}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Skills */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Add a skill"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          />
          <Button type="button" onClick={addSkill} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Experience</h3>
          <Button type="button" onClick={addExperience} variant="outline" size="sm">
            Add Experience
          </Button>
        </div>
        {formData.experience.map((exp, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Job Title"
                value={exp.title}
                onChange={(e) => updateExperience(index, 'title', e.target.value)}
              />
              <Input
                label="Company"
                value={exp.company}
                onChange={(e) => updateExperience(index, 'company', e.target.value)}
              />
              <Input
                label="Location"
                value={exp.location}
                onChange={(e) => updateExperience(index, 'location', e.target.value)}
              />
              <Input
                label="Start Date"
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
              />
              {!exp.current && (
                <Input
                  label="End Date"
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                />
              )}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Currently working here</span>
              </label>
            </div>
            <textarea
              placeholder="Description"
              value={exp.description}
              onChange={(e) => updateExperience(index, 'description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
            <Button
              type="button"
              onClick={() => removeExperience(index)}
              variant="danger"
              size="sm"
              className="mt-2"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* Education */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Education</h3>
          <Button type="button" onClick={addEducation} variant="outline" size="sm">
            Add Education
          </Button>
        </div>
        {formData.education.map((edu, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Degree"
                value={edu.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
              />
              <Input
                label="Institution"
                value={edu.institution}
                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
              />
              <Input
                label="Location"
                value={edu.location}
                onChange={(e) => updateEducation(index, 'location', e.target.value)}
              />
              <Input
                label="Start Date"
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
              />
              {!edu.current && (
                <Input
                  label="End Date"
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                />
              )}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={edu.current}
                  onChange={(e) => updateEducation(index, 'current', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Currently studying</span>
              </label>
            </div>
            <Button
              type="button"
              onClick={() => removeEducation(index)}
              variant="danger"
              size="sm"
              className="mt-2"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* Preferences */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Job Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Type
            </label>
            <div className="space-y-2">
              {['Full-time', 'Part-time', 'Contract', 'Freelance', 'Remote'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.preferences.jobType.includes(type)}
                    onChange={() => handleJobTypeChange(type)}
                    className="mr-2"
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>
          <Input
            label="Desired Salary (Annual)"
            name="preferences.desiredSalary"
            type="number"
            value={formData.preferences.desiredSalary}
            onChange={handleChange}
            placeholder="e.g., 80000"
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              name="preferences.willingToRelocate"
              checked={formData.preferences.willingToRelocate}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">Willing to relocate</span>
          </label>
        </div>
      </div>

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        Save Profile
      </Button>
    </form>
  );
};

export default ProfileForm;
