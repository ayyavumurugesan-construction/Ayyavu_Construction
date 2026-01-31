import React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Home, Ruler, Calendar, Building } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { PropertyListing } from '../lib/supabase';


const Properties = () => {
  const [searchParams] = useSearchParams();
  const [propertyType, setPropertyType] = useState<'residential' | 'commercial'>('residential');
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check URL parameter for property type
    const typeParam = searchParams.get('type');
    if (typeParam === 'residential' || typeParam === 'commercial') {
      setPropertyType(typeParam);
    }
    fetchProperties();
  }, [searchParams]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('property_listings')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => property.property_type === propertyType);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const handleContactSeller = (property: PropertyListing) => {
    const message = `Hi, I'm interested in your property: ${property.title} located at ${property.location}. Could you please provide more details?`;
    const whatsappUrl = `https://wa.me/${property.contact_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCallSeller = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmailSeller = (email: string, property: PropertyListing) => {
    const subject = `Inquiry about ${property.title}`;
    const body = `Hi,\n\nI'm interested in your property: ${property.title}\nLocation: ${property.location}\nPrice: ${property.price}\n\nCould you please provide more details?\n\nThank you.`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleBackClick = () => {
    window.history.back();
  };

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
              {propertyType === 'residential' ? 'Residential Properties' : 'Commercial Properties'}
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="construction-card rounded-2xl p-8 mx-auto max-w-md">
              <div className="text-gray-800 text-xl">Loading properties...</div>
            </div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="construction-card rounded-2xl p-8 mx-auto max-w-md">
              <div className="text-gray-800 text-xl">No {propertyType} properties available at the moment.</div>
              <p className="text-gray-600 mt-2">Check back later for new listings!</p>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <div 
              key={property.id}
              className="construction-card rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
            >
              {/* Property Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={property.images?.[0] || "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800"} 
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
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

              {/* Property Details */}
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

                {/* Contact Info */}
                <div className="mb-4 text-sm text-gray-500">
                  <p>Contact: {property.contact_name}</p>
                  <p>Phone: {property.contact_phone}</p>
                  <p>Email: {property.contact_email}</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button 
                    onClick={() => handleContactSeller(property)}
                    className="w-full py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2"
                  >
                    <span>WhatsApp</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleCallSeller(property.contact_phone)}
                      className="py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                      Call
                    </button>
                    <button 
                      onClick={() => handleEmailSeller(property.contact_email, property)}
                      className="py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 bg-orange-600 hover:bg-orange-700 text-white text-sm"
                    >
                      Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-blue-900/20 via-blue-800/20 to-green-900/20 border-t border-blue-300/30 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="construction-card rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Interested in Any Property?</h2>
            <p className="text-gray-600 mb-6">Contact us for site visits, documentation, and personalized assistance.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="construction-button text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105">
              <a href="tel:+919360493616">Schedule Site Visit</a>
            </button>
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-green-600 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105">
              <a href="https://wa.me/919360493616?text=Hi, I would like to get price details for properties">Get Price Details</a>
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;