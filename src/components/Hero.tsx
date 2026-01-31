import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Home, Users, Award } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  const handleBuyClick = () => {
    navigate('/properties');
  };

  const handleSellClick = () => {
    navigate('/sell');
  };

  return (
    <section id="home" className="relative min-h-screen py-20 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/60 to-green-900/80"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-blue-900/40"></div>
      {/* Bright overlay effects */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/30 via-white/10 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center relative z-10 pt-20 text-white">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
            Ayyavu Constructions
          </h2>
          <p className="text-xl sm:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            <h1><b className="inline-block bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-3 text-sm shadow-lg hover:bg-white/25 hover:border-white/40 transition-all duration-300 font-semibold"> Creating Heavens on Earth</b></h1><br />
            Ayyavu Constructions - Building trust, creating homes, and shaping communities for over a decade
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={handleBuyClick}
              className="construction-button text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Buy
            </button>
            <button 
              onClick={handleSellClick}
              className="border-2 border-white/50 text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Sell
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 hover:scale-110 transition-all duration-300 cursor-pointer hover:bg-white/20 rounded-lg p-4 hover:shadow-lg">
              <Home className="h-8 w-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">100+</div>
                <div className="text-white/80">Homes Built</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 hover:scale-110 transition-all duration-300 cursor-pointer hover:bg-white/20 rounded-lg p-4 hover:shadow-lg">
              <Users className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-white/80">Happy Families</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 hover:scale-110 transition-all duration-300 cursor-pointer hover:bg-white/20 rounded-lg p-4 hover:shadow-lg">
              <Award className="h-8 w-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">20+</div>
                <div className="text-white/80">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;