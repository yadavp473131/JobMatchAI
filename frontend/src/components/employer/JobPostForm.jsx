import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const JobPostForm = ({ initialData = {}, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    requirements: initialData.requirements || '',
    responsibilities: initialData.responsibilities || '',
    skills: initialData.skills || [],
    type: initialData.type || 'Full-time',
    location: initialData.location || '',
    salary: {
      min: initialData.salary?.min || '',
      max: initialData.salary?.max || '',
      currency: initialData.salary?.currency || 'USD',
    },
    experienceLevel: initialData.experienceLevel || 'Mid-level',
    benefits: initialData.benefits || '',
    applicationDeadline: initialData.applicationDeadline || '',
  });

  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
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

  const validate = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = 'Job title is required';
    if (!formData.description) newErrors.description = 'Job description is required';
    if (!formData.requirements) newErrors.requirements = 'Requirements are required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (formData.skills.length === 0) newErrors.skills = 'At least one skill is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Remote'];
  const experienceLevels = ['Entry-level', 'Mid-level', 'Senior', 'Lead', 'Executive'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="space-y-4">
          <Input
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="e.g., Senior Software Engineer"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the role and what the candidate will be doing..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level <span className="text-red-500">*</span>
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
            placeholder="e.g., San Francisco, CA or Remote"
            required
          />
        </div>
      </div>

      {/* Requirements & Responsibilities */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Requirements & Responsibilities
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements <span className="text-red-500">*</span>
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows="4"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.requirements ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="List the required qualifications, skills, and experience..."
            />
            {errors.requirements && (
              <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsibilities
            </label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the key responsibilities of this role..."
            />
          </div>
        </div>
      </div>

      {/* Skills */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Required Skills <span className="text-red-500">*</span>
        </h3>
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
        {errors.skills && (
          <p className="mb-2 text-sm text-red-600">{errors.skills}</p>
        )}
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

      {/* Salary */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Salary Range</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Minimum Salary"
            name="salary.min"
            type="number"
            value={formData.salary.min}
            onChange={handleChange}
            placeholder="e.g., 80000"
          />
          <Input
            label="Maximum Salary"
            name="salary.max"
            type="number"
            value={formData.salary.max}
            onChange={handleChange}
            placeholder="e.g., 120000"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              name="salary.currency"
              value={formData.salary.currency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Benefits</h3>
        <textarea
          name="benefits"
          value={formData.benefits}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="List the benefits and perks (e.g., health insurance, 401k, remote work, etc.)"
        />
      </div>

      {/* Application Deadline */}
      <div>
        <Input
          label="Application Deadline"
          name="applicationDeadline"
          type="date"
          value={formData.applicationDeadline}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        {initialData._id ? 'Update Job Posting' : 'Post Job'}
      </Button>
    </form>
  );
};

export default JobPostForm;
