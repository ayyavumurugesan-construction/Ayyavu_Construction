import React from 'react';
import { Building, Home, Key, Users, MapPin, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();

  const handleViewResidential = () => {
    navigate('/properties?type=residential');
  };

  const handleViewCommercial = () => {
    navigate('/properties?type=commercial');
  };

  const services = [
    {
      icon: Building,
      title: "Investment Advisory",
      description: "Expert guidance on real estate investments with market insights and analysis.",
      hasViewButton: false,
      size: "small"
    },
    {
      icon: Home,
      title: "Residential Projects",
      description: "Premium apartments and villas designed for modern living with world-class amenities.",
      hasViewButton: true,
      onView: handleViewResidential,
      size: "large"
    },
    {
      icon: Building,
      title: "Commercial Spaces",
      description: "Strategic commercial properties and office spaces in prime locations for your business.",
      hasViewButton: true,
      onView: handleViewCommercial,
      size: "large"
    },
    {
      icon: Key,
      title: "Property Management",
      description: "Complete property management services from documentation to maintenance.",
      hasViewButton: false,
      size: "small"
    }
  ];

  return (
    <section id="services" className="py-20 relative bg-gradient-to-br from-blue-900/10 via-blue-800/10 to-green-900/10">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/60 to-green-900/80"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Our Services
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Comprehensive real estate solutions tailored to meet your unique needs and aspirations
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {services.map((service, index) => (
            <div key={index} className={`construction-card rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer relative overflow-hidden ${
              service.size === 'small' ? 'p-5' : 'p-7'
            }`}>
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600/20 to-green-600/20 rounded-lg mb-6 mx-auto border border-blue-300/30">
                <service.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                {service.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed mb-6">
                {service.description}
              </p>
              
              {service.hasViewButton && (
                <div className="flex justify-center">
                  <button
                    onClick={service.onView}
                    className="construction-button relative px-8 py-3 text-white rounded-full font-semibold transition-all duration-500 overflow-hidden group"
                  >
                    <span className="relative z-10">View</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;