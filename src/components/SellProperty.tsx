import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, MapPin, Home, Ruler, Phone, Mail, User, IndianRupee, Building } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SellProperty = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    area: '',
    location: '',
    property_type: 'residential' as 'residential' | 'commercial',
    contact_name: '',
    contact_phone: '',
    contact_email: ''
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setImages(prev => [...prev, ...files]);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitLoading(true);
    try {
      // Upload images to Supabase storage
      const imageUrls: string[] = [];
      for (const image of images) {
        const fileName = `${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(fileName, image);
        
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);
        
        imageUrls.push(publicUrl);
      }

      // Insert property listing
      const { error } = await supabase
        .from('property_listings')
        .insert({
          ...formData,
          images: imageUrls,
          user_id: null,
          status: 'pending'
        });

      if (error) throw error;

      alert('Property listing submitted successfully! It will be reviewed before being published.');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        area: '',
        location: '',
        property_type: 'residential',
        contact_name: '',
        contact_phone: '',
        contact_email: ''
      });
      setImages([]);
      setImagePreviews([]);
      
      // Redirect to properties page after successful submission
      setTimeout(() => {
        window.location.href = '/properties';
      }, 2000);
    } catch (error: any) {
      alert('Error submitting property: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleBackClick}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-green-500 to-blue-700 bg-clip-text text-transparent">
              Sell Your Property
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Submit your property for review
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="construction-card rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">List Your Property</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Property Type</label>
              <div className="flex justify-center">
                <div className="bg-blue-50 rounded-full border border-blue-100 p-2">
                  <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, property_type: 'residential' }))}
                      className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    formData.property_type === 'residential'
                        ? 'construction-button text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-blue-100'
                  }`}
                >
                      Residential
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, property_type: 'commercial' }))}
                      className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    formData.property_type === 'commercial'
                        ? 'construction-button text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-blue-100'
                  }`}
                >
                      Commercial
                </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Property Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bright-form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                  placeholder="e.g., Premium Residential Plot"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Price</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="bright-form-input w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none"
                    placeholder="e.g., ₹2.5 Cr"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Area</label>
                <input
                  type="text"
                  required
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                  className="bright-form-input w-full px-4 py-3 rounded-lg focus:outline-none"
                  placeholder="e.g., 3 cent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="bright-form-input w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none"
                    placeholder="e.g., Jubilee Hills, Hyderabad"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bright-form-input w-full px-4 py-3 rounded-lg focus:outline-none resize-none"
                placeholder="Describe your property in detail..."
              />
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Contact Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.contact_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                    className="bright-form-input w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={formData.contact_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                    className="bright-form-input w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none"
                    placeholder="+91 1234567890"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                    className="bright-form-input w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Property Images (Max 5)</label>
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors bg-blue-50/50">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-700">Click to upload images or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB each</p>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitLoading}
              className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                submitLoading 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'construction-button text-white'
              }`}
            >
              {submitLoading ? 'Submitting...' : 'Submit Property Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellProperty;