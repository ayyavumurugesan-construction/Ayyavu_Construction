import React from 'react';
import { CheckCircle } from 'lucide-react';

const About = () => {
  const features = [
    "Quality construction with premium materials",
    "Transparent pricing and documentation",
    "On-time project delivery",
    "Customer-centric approach",
    "Legal compliance and approvals",
    "Post-sales support and service"
  ];

  return (
    <section id="about" className="py-20 relative bg-gradient-to-br from-blue-50 to-green-50">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-blue-50/90 to-white/95"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
              Why Choose Ayyavu Constructions?
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              With over 20+ years of experience in the real estate industry, Ayyavu Constructions has 
              established itself as a trusted name in property development. We are committed to 
              delivering exceptional quality homes and commercial spaces that exceed expectations.
            </p>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="construction-card p-8 rounded-2xl hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
            <div className="text-center">
              <div className="text-4xl font-bold stats-counter mb-2">20+</div>
              <div className="text-gray-700 mb-6 font-medium">Years of Excellence</div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center hover:scale-110 transition-all duration-300 cursor-pointer p-2 rounded-lg hover:bg-blue-50">
                  <div className="text-2xl font-bold stats-counter">100+</div>
                  <div className="text-sm text-gray-600">Projects Completed</div>
                </div>
                <div className="text-center hover:scale-110 transition-all duration-300 cursor-pointer p-2 rounded-lg hover:bg-white/10">
                <div className="text-center hover:scale-110 transition-all duration-300 cursor-pointer p-2 rounded-lg hover:bg-blue-50">
                  <div className="text-2xl font-bold stats-counter">500+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center hover:scale-110 transition-all duration-300 cursor-pointer p-2 rounded-lg hover:bg-white/10">
                <div className="text-center hover:scale-110 transition-all duration-300 cursor-pointer p-2 rounded-lg hover:bg-blue-50">
                  <div className="text-2xl font-bold stats-counter">50+</div>
                  <div className="text-sm text-gray-600">Ongoing Projects</div>
                </div>
                <div className="text-center hover:scale-110 transition-all duration-300 cursor-pointer p-2 rounded-lg hover:bg-white/10">
                <div className="text-center hover:scale-110 transition-all duration-300 cursor-pointer p-2 rounded-lg hover:bg-blue-50">
                  <div className="text-2xl font-bold stats-counter">99%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;