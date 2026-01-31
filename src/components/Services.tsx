import React from 'react';
import { CheckCircle, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();

  const handleViewProperties = () => {
    navigate('/properties');
  };

  const projects = [
    {
      icon: CheckCircle,
      title: "Completed Projects",
      description: "Over 100+ successfully delivered residential and commercial projects with satisfied customers across the region.",
      count: "100+",
      status: "completed",
      color: "from-green-600/20 to-emerald-600/20",
      iconColor: "text-green-600",
      borderColor: "border-green-300/30"
    },
    {
      icon: Clock,
      title: "Ongoing Projects",
      description: "Currently executing 15+ premium residential and commercial developments with modern amenities and quality construction.",
      count: "15+",
      status: "ongoing",
      color: "from-blue-600/20 to-cyan-600/20",
      iconColor: "text-blue-600",
      borderColor: "border-blue-300/30"
    },
    {
      icon: Calendar,
      title: "Upcoming Projects",
      description: "Exciting new developments planned for launch, featuring innovative designs and prime locations for future homeowners.",
      count: "8+",
      status: "upcoming",
      color: "from-orange-600/20 to-yellow-600/20",
      iconColor: "text-orange-600",
      borderColor: "border-orange-300/30"
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
            Our Projects
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Building dreams across different phases - from completed masterpieces to exciting upcoming developments
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 mb-12">
          {projects.map((project, index) => (
            <div key={index} className="construction-card rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer relative overflow-hidden p-8">
              <div className={`flex items-center justify-center w-20 h-20 bg-gradient-to-br ${project.color} rounded-xl mb-6 mx-auto border ${project.borderColor}`}>
                <project.icon className={`h-10 w-10 ${project.iconColor}`} />
              </div>
              
              <div className="text-center mb-4">
                <div className={`text-4xl font-bold ${project.iconColor} mb-2`}>
                  {project.count}
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {project.title}
                </h3>
              </div>
              
              <p className="text-gray-600 text-center leading-relaxed mb-6">
                {project.description}
              </p>
              
              <div className="flex justify-center">
                <button
                  onClick={handleViewProperties}
                  className="construction-button relative px-8 py-3 text-white rounded-full font-semibold transition-all duration-500 overflow-hidden group"
                >
                  <span className="relative z-10">View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="text-center relative z-10">
          <div className="construction-card rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Interested in Our Projects?
            </h3>
            <p className="text-gray-600 mb-6">
              Explore our portfolio and find your perfect property investment opportunity
            </p>
            <button
              onClick={handleViewProperties}
              className="construction-button text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Browse All Properties
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;