import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const EmployerProfileForm = ({ initialData = {}, onSubmit, loading, onLogoUpload }) => {
  const [formData, setFormData] = useState({
    companyName: initialData.companyName || '',
    companyDescription: initialData.companyDescription || '',
    industry: initialData.industry || '',
    companySize: initialData.companySize || '',
    website: initialData.website || '',
    location: {
      address: initialData.location?.address || '',
      city: initialData.location?.city || '',
      state: initialData.location?.state || '',
      country: initialData.location?.country || '',
      zipCode: initialData.location?.zipCode || '',
    },
    contactEmail: initialData.contactEmail || '',
    contactPhone: initialData.contactPhone || '',
  });

  const [errors, setErrors] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(initialData.companyLogo || null);

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

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, logo: 'Please select an image file' }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, logo: 'Image size must be less than 2MB' }));
        return;
      }

      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, logo: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.companyDescription) newErrors.companyDescription = 'Company description is required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    if (!formData.contactEmail) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      // Upload logo first if there's a new one
      if (logoFile && onLogoUpload) {
        await onLogoUpload(logoFile);
      }
      onSubmit(formData);
    }
  };

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Company Logo */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Company Logo</h3>
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Company logo"
                className="h-24 w-24 rounded-lg object-cover border-2 border-gray-300"
              />
            ) : (
              <div className="h-24 w-24 rounded-lg bg-gray-200 flex items-center justify-center">
                <svg
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, GIF up to 2MB
            </p>
            {errors.logo && (
              <p className="mt-1 text-sm text-red-600">{errors.logo}</p>
            )}
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
        <div className="space-y-4">
          <Input
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            error={errors.companyName}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="companyDescription"
              value={formData.companyDescription}
              onChange={handleChange}
              rows="4"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.companyDescription ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Tell us about your company..."
            />
            {errors.companyDescription && (
              <p className="mt-1 text-sm text-red-600">{errors.companyDescription}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              error={errors.industry}
              placeholder="e.g., Technology, Healthcare"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Size
              </label>
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select company size</option>
                {companySizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.example.com"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
        <div className="space-y-4">
          <Input
            label="Address"
            name="location.address"
            value={formData.location.address}
            onChange={handleChange}
            placeholder="Street address"
          />
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
              label="Zip Code"
              name="location.zipCode"
              value={formData.location.zipCode}
              onChange={handleChange}
            />
          </div>
          <Input
            label="Country"
            name="location.country"
            value={formData.location.country}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Contact Email"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleChange}
            error={errors.contactEmail}
            required
          />
          <Input
            label="Contact Phone"
            name="contactPhone"
            type="tel"
            value={formData.contactPhone}
            onChange={handleChange}
          />
        </div>
      </div>

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        Save Company Profile
      </Button>
    </form>
  );
};

export default EmployerProfileForm;
