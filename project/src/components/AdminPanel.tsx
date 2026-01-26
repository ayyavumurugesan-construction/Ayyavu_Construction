import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Check, X, Trash2, Plus, Upload, MapPin, Home, Building, Phone, Mail, User, IndianRupee } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { PropertyListing } from '../lib/supabase';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'properties' | 'contacts' | 'add'>('properties');
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  
  // Add property form state
  const [newProperty, setNewProperty] = useState({
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
  const [newPropertyImages, setNewPropertyImages] = useState<File[]>([]);
  const [newPropertyPreviews, setNewPropertyPreviews] = useState<string[]>([]);
  const [addingProperty, setAddingProperty] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('property_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;
      setProperties(propertiesData || []);

      // Fetch contact messages
      const { data: contactsData, error: contactsError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (contactsError) throw contactsError;
      setContacts(contactsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePropertyStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('property_listings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      setProperties(prev => 
        prev.map(p => p.id === id ? { ...p, status } : p)
      );
      
      alert(`Property ${status} successfully!`);
    } catch (error: any) {
      alert('Error updating property: ' + error.message);
    }
  };

  const deleteProperty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const { error } = await supabase
        .from('property_listings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProperties(prev => prev.filter(p => p.id !== id));
      alert('Property deleted successfully!');
    } catch (error: any) {
      alert('Error deleting property: ' + error.message);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setContacts(prev => prev.filter(c => c.id !== id));
      alert('Contact message deleted successfully!');
    } catch (error: any) {
      alert('Error deleting contact: ' + error.message);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + newPropertyImages.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setNewPropertyImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewPropertyPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setNewPropertyImages(prev => prev.filter((_, i) => i !== index));
    setNewPropertyPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingProperty(true);

    try {
      // Upload images
      const imageUrls: string[] = [];
      for (const image of newPropertyImages) {
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

      // Insert property with approved status
      const { error } = await supabase
        .from('property_listings')
        .insert({
          ...newProperty,
          images: imageUrls,
          status: 'approved',
          user_id: null
        });

      if (error) throw error;

      alert('Property added successfully!');
      
      // Reset form
      setNewProperty({
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
      setNewPropertyImages([]);
      setNewPropertyPreviews([]);
      
      // Refresh data
      fetchData();
      setActiveTab('properties');
    } catch (error: any) {
      alert('Error adding property: ' + error.message);
    } finally {
      setAddingProperty(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'rejected': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const handleBackClick = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="construction-card rounded-2xl p-8 text-center">
          <div className="text-2xl font-bold text-gray-800 mb-2">Loading Admin Panel...</div>
          <div className="text-gray-600">Please wait while we fetch the data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900/10 via-blue-800/10 to-green-900/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/90 via-blue-800/90 to-green-900/90 backdrop-blur-md border-b border-blue-300/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleBackClick}
              className="flex items-center space-x-2 text-white/90 hover:text-white transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </button>
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">
              Admin Panel
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-blue-900/90 via-blue-800/90 to-green-900/90 backdrop-blur-md rounded-full border border-blue-300/30 shadow-lg p-2">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('properties')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === 'properties'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Properties ({properties.length})
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === 'contacts'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Contacts ({contacts.length})
              </button>
              <button
                onClick={() => setActiveTab('add')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === 'add'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Plus className="h-4 w-4 inline mr-2" />
                Add Property
              </button>
            </div>
          </div>
        </div>

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="construction-card rounded-2xl p-6 mx-auto max-w-2xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Property Management</h2>
                <p className="text-gray-600">Review, approve, and manage property listings</p>
              </div>
            </div>
            
            {properties.length === 0 ? (
              <div className="construction-card rounded-2xl p-12 text-center">
                <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Properties Found</h3>
                <p className="text-gray-600">No property listings available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <div key={property.id} className="construction-card rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={property.images?.[0] || "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800"} 
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(property.status)}`}>
                          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                        </span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                          {property.property_type === 'residential' ? <Home className="h-3 w-3 mr-1" /> : <Building className="h-3 w-3 mr-1" />}
                          {property.property_type === 'residential' ? 'Residential' : 'Commercial'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{property.title}</h3>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-sm">{property.location}</span>
                      </div>

                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-blue-600">{property.price}</span>
                        <span className="text-gray-600 text-sm">{property.area}</span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

                      <div className="mb-4 text-sm text-gray-500">
                        <p>Contact: {property.contact_name}</p>
                        <p>Phone: {property.contact_phone}</p>
                        <p>Email: {property.contact_email}</p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedProperty(property)}
                          className="flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 bg-blue-600 hover:bg-blue-700 text-white text-sm flex items-center justify-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        {property.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updatePropertyStatus(property.id, 'approved')}
                              className="flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 bg-green-600 hover:bg-green-700 text-white text-sm flex items-center justify-center"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => updatePropertyStatus(property.id, 'rejected')}
                              className="flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 bg-red-600 hover:bg-red-700 text-white text-sm flex items-center justify-center"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteProperty(property.id)}
                          className="py-2 px-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 bg-red-600 hover:bg-red-700 text-white text-sm flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Contact Messages</h2>
              <p className="text-gray-600">Review and manage customer inquiries</p>
            </div>
            
            {contacts.length === 0 ? (
              <div className="construction-card rounded-2xl p-12 text-center">
                <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Messages Found</h3>
                <p className="text-gray-600">No contact messages available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contacts.map((contact) => (
                  <div key={contact.id} className="construction-card rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{contact.name}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(contact.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="p-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-blue-600" />
                        <a href={`mailto:${contact.email}`} className="hover:text-blue-600 transition-colors">
                          {contact.email}
                        </a>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-green-600" />
                        <a href={`tel:${contact.phone}`} className="hover:text-green-600 transition-colors">
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-700 leading-relaxed">{contact.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Property Tab */}
        {activeTab === 'add' && (
          <div className="max-w-4xl mx-auto">
            <div className="construction-card rounded-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Add New Property</h2>
                <p className="text-gray-600">Create a new property listing that will be automatically approved</p>
              </div>
              
              <form onSubmit={addProperty} className="space-y-6">
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Property Type</label>
                  <div className="flex justify-center">
                    <div className="bg-blue-50 rounded-full border border-blue-100 p-2">
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setNewProperty(prev => ({ ...prev, property_type: 'residential' }))}
                          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                            newProperty.property_type === 'residential'
                              ? 'construction-button text-white shadow-lg'
                              : 'text-gray-600 hover:text-gray-800 hover:bg-blue-100'
                          }`}
                        >
                          Residential
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewProperty(prev => ({ ...prev, property_type: 'commercial' }))}
                          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                            newProperty.property_type === 'commercial'
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
                      value={newProperty.title}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, title: e.target.value }))}
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
                        value={newProperty.price}
                        onChange={(e) => setNewProperty(prev => ({ ...prev, price: e.target.value }))}
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
                      value={newProperty.area}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, area: e.target.value }))}
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
                        value={newProperty.location}
                        onChange={(e) => setNewProperty(prev => ({ ...prev, location: e.target.value }))}
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
                    value={newProperty.description}
                    onChange={(e) => setNewProperty(prev => ({ ...prev, description: e.target.value }))}
                    className="bright-form-input w-full px-4 py-3 rounded-lg focus:outline-none resize-none"
                    placeholder="Describe the property in detail..."
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
                        value={newProperty.contact_name}
                        onChange={(e) => setNewProperty(prev => ({ ...prev, contact_name: e.target.value }))}
                        className="bright-form-input w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none"
                        placeholder="Contact person name"
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
                        value={newProperty.contact_phone}
                        onChange={(e) => setNewProperty(prev => ({ ...prev, contact_phone: e.target.value }))}
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
                        value={newProperty.contact_email}
                        onChange={(e) => setNewProperty(prev => ({ ...prev, contact_email: e.target.value }))}
                        className="bright-form-input w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none"
                        placeholder="contact@email.com"
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
                      id="admin-image-upload"
                    />
                    <label htmlFor="admin-image-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                      <p className="text-gray-700">Click to upload images or drag and drop</p>
                      <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB each</p>
                    </label>
                  </div>

                  {/* Image Previews */}
                  {newPropertyPreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                      {newPropertyPreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
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
                  disabled={addingProperty}
                  className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                    addingProperty 
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : 'construction-button text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {addingProperty ? 'Adding Property...' : 'Add Property'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="construction-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{selectedProperty.title}</h2>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* Property Images */}
              {selectedProperty.images && selectedProperty.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {selectedProperty.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${selectedProperty.title} ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Property Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Type:</span> {selectedProperty.property_type}</p>
                      <p><span className="font-medium">Price:</span> {selectedProperty.price}</p>
                      <p><span className="font-medium">Area:</span> {selectedProperty.area}</p>
                      <p><span className="font-medium">Location:</span> {selectedProperty.location}</p>
                      <p><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedProperty.status)}`}>
                          {selectedProperty.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedProperty.contact_name}</p>
                      <p><span className="font-medium">Phone:</span> {selectedProperty.contact_phone}</p>
                      <p><span className="font-medium">Email:</span> {selectedProperty.contact_email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{selectedProperty.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {selectedProperty.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        updatePropertyStatus(selectedProperty.id, 'approved');
                        setSelectedProperty(null);
                      }}
                      className="flex-1 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
                    >
                      <Check className="h-5 w-5 mr-2" />
                      Approve Property
                    </button>
                    <button
                      onClick={() => {
                        updatePropertyStatus(selectedProperty.id, 'rejected');
                        setSelectedProperty(null);
                      }}
                      className="flex-1 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Reject Property
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    deleteProperty(selectedProperty.id);
                    setSelectedProperty(null);
                  }}
                  className="py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;