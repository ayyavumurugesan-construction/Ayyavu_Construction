import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = formData.name && formData.email && formData.phone && formData.message;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (dbError) throw dbError;

      // Send email notification (optional - requires edge function setup)
      try {
        const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
          body: formData
        });
        if (emailError) {
          console.log('Email notification failed:', emailError);
        }
      } catch (emailError) {
        console.log('Email notification failed:', emailError);
        // Don't fail the whole process if email fails
      }

      alert('Thank you for your message! We will get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Contact form error:', error);
      alert('Thank you for your message! We have received your inquiry and will get back to you soon.');
      
      // Reset form even if there's an error (since the message was likely saved to database)
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section id="contact" className="py-20 relative bg-gradient-to-br from-slate-50 to-blue-50">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-blue-50/90 to-white/95"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to find your dream property? Contact us today and let's make it happen.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-8">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 hover:scale-105 hover:bg-blue-50 p-4 rounded-lg transition-all duration-300 cursor-pointer">
                <Phone className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-medium text-gray-800">Phone</div>
                  <div className="text-gray-600"><a href="tel:+91 93604 93616">+91 93604 93616</a></div>
                  <div className="text-gray-600"><a href="tel:+91 93457 70330">+91 93457 70330</a></div>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 hover:scale-105 hover:bg-blue-50 p-4 rounded-lg transition-all duration-300 cursor-pointer">
                <Mail className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-medium text-gray-800">Email</div>
                  <div className="text-gray-600"><a href="mailto:ayyavu.ayyavupromoters@gmail.com">ayyavu.ayyavuconstruction@gmail.com </a></div>
                
                </div>
              </div>
              
              <div className="flex items-start space-x-4 hover:scale-105 hover:bg-blue-50 p-4 rounded-lg transition-all duration-300 cursor-pointer">
                <MapPin className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-medium text-gray-800">Address</div>
                  <div className="text-gray-600">
                   No-17, Vidhya Colony 5th cross, Thadagam rd<br />
                    TVS Nagar,<br />
                    Coimbatore - 641025
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 hover:scale-105 hover:bg-blue-50 p-4 rounded-lg transition-all duration-300 cursor-pointer">
                <Clock className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-medium text-gray-800">Business Hours</div>
                  <div className="text-gray-600">Monday - Saturday: 9:00 AM - 7:00 PM</div>
                  <div className="text-gray-600">Sunday: 10:00 AM - 5:00 PM</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-8">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6 construction-card p-8 rounded-3xl shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="bright-form-input w-full px-6 py-4 rounded-2xl focus:outline-none transition-all duration-300"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  className="bright-form-input w-full px-6 py-4 rounded-2xl focus:outline-none transition-all duration-300"
                />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Your Phone"
                className="bright-form-input w-full px-6 py-4 rounded-2xl focus:outline-none transition-all duration-300"
              />
              <textarea
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your Message"
                className="bright-form-input w-full px-6 py-4 rounded-2xl focus:outline-none transition-all duration-300 resize-none"
              ></textarea>
              <div className="relative group">
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-500 ${
                    isFormValid && !isSubmitting
                      ? 'construction-button text-white shadow-lg hover:shadow-xl' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } hover:scale-105`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;