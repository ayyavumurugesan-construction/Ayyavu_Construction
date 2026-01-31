import React from 'react';
import { Building, Users, Award, TrendingUp, Shield, Heart } from 'lucide-react';

const About = () => {
  const achievements = [
    {
      icon: Building,
      title: "100+ Projects",
      description: "Successfully delivered residential and commercial projects"
    },
    {
      icon: Users,
      title: "500+ Happy Families",
      description: "Creating homes and building lasting relationships"
    },
    {
      icon: Award,
      title: "20+ Years Experience",
      description: "Two decades of excellence in real estate"
    },
    {
      icon: Shield,
      title: "100% Legal Compliance",
      description: "All properties with proper documentation and approvals"
    }
  ];

  return (
    <section id="about" className="py-20 relative bg-gradient-to-br from-blue-900/10 via-blue-800/10 to-green-900/10">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/60 to-green-900/80"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-lg">
            About Ayyavu Constructions
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Building trust and creating dream homes for over two decades
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="construction-card rounded-3xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Our Story</h3>
            <div className="space-y-4 text-gray-600">
              <p>
                Ayyavu Constructions has been a trusted name in the real estate industry for over 20 years.
                We started with a simple vision: to create quality homes that families can cherish for generations.
              </p>
              <p>
                Over the years, we've grown from a small construction firm to a respected real estate company,
                completing 100+ projects and serving 500+ happy families across the region.
              </p>
              <p>
                Our commitment to quality, transparency, and customer satisfaction has made us one of the
                most trusted names in residential and commercial real estate development.
              </p>
            </div>
          </div>

          <div className="construction-card rounded-3xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Our Values</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Integrity</h4>
                  <p className="text-gray-600 text-sm">
                    We believe in transparent dealings and honest communication with all our clients.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Award className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Quality</h4>
                  <p className="text-gray-600 text-sm">
                    Every project is built with the highest standards of construction and materials.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Heart className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Customer First</h4>
                  <p className="text-gray-600 text-sm">
                    Your dream home is our priority. We work tirelessly to exceed expectations.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Innovation</h4>
                  <p className="text-gray-600 text-sm">
                    We embrace modern construction techniques and sustainable practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="construction-card rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600/20 to-green-600/20 rounded-full mb-4 mx-auto border border-blue-300/30">
                <achievement.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">{achievement.title}</h4>
              <p className="text-gray-600 text-sm">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
