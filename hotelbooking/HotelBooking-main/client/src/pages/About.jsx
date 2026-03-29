import React from 'react';
import { assets } from '../assets/assets';
import Title from '../components/Title';

const About = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className='flex flex-col items-center justify-center px-6 md:px-16 lg:px-24 xl:px-32 py-20 bg-gradient-to-b from-blue-50 to-white text-center'>
        <div className="max-w-3xl">
          <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full inline-block mb-6 font-semibold text-sm">
            ABOUT QUICKSTAY
          </p>
          <h1 className="font-playfair text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Gateway to Extraordinary Travel Experiences
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            At QuickStay, we believe that travel is more than just booking a room—it's about creating unforgettable memories and discovering the world's most remarkable destinations.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl h-96 md:h-full min-h-96 shadow-xl flex items-center justify-center text-white">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🌍</div>
                <p className="font-playfair text-3xl font-bold">Connecting Travelers to Dream Destinations</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-6">
              Our <span className="text-blue-600">Mission</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              We're committed to making luxury travel accessible to everyone. Our mission is to connect travelers with the world's finest accommodations and provide seamless booking experiences that turn travel dreams into reality.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Every property in our collection has been carefully curated to ensure it meets our high standards for comfort, service, and unique experiences.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-2xl text-yellow-500 mt-1">✨</span>
                <div>
                  <p className="font-semibold text-gray-900">Premium Selection</p>
                  <p className="text-gray-600 text-sm">Hand-picked properties that deliver excellence</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl text-yellow-500 mt-1">🔒</span>
                <div>
                  <p className="font-semibold text-gray-900">Trusted & Secure</p>
                  <p className="text-gray-600 text-sm">Your safety and privacy are our top priorities</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl text-yellow-500 mt-1">💬</span>
                <div>
                  <p className="font-semibold text-gray-900">24/7 Support</p>
                  <p className="text-gray-600 text-sm">Always here to help with any questions</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 md:px-16 lg:px-24 xl:px-32 py-16 md:py-20">
        <div className="text-center mb-12">
          <Title 
            title="Our Core Values" 
            subTitle="These principles guide everything we do at QuickStay"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Value 1 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">❤️</div>
            <h3 className="font-playfair text-xl font-bold text-gray-900 mb-3">Guest First</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your satisfaction is at the heart of everything we do. We listen, adapt, and improve based on your feedback.
            </p>
          </div>

          {/* Value 2 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="font-playfair text-xl font-bold text-gray-900 mb-3">Excellence</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We pursue excellence in every aspect—from property selection to customer service and digital experience.
            </p>
          </div>

          {/* Value 3 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="font-playfair text-xl font-bold text-gray-900 mb-3">Sustainability</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We're committed to responsible travel practices and partnering with eco-conscious properties worldwide.
            </p>
          </div>

          {/* Value 4 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="font-playfair text-xl font-bold text-gray-900 mb-3">Partnerships</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We believe in building strong relationships with our partners to create better experiences for you.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="py-6">
            <h3 className="font-playfair text-4xl md:text-5xl font-bold text-blue-600 mb-2">500K+</h3>
            <p className="text-gray-600 font-semibold">Happy Guests</p>
            <p className="text-sm text-gray-500 mt-2">Travelers who've found their perfect stay</p>
          </div>
          <div className="py-6 border-l border-r border-gray-200">
            <h3 className="font-playfair text-4xl md:text-5xl font-bold text-blue-600 mb-2">10K+</h3>
            <p className="text-gray-600 font-semibold">Properties</p>
            <p className="text-sm text-gray-500 mt-2">Handpicked destinations worldwide</p>
          </div>
          <div className="py-6 border-r border-gray-200">
            <h3 className="font-playfair text-4xl md:text-5xl font-bold text-blue-600 mb-2">150+</h3>
            <p className="text-gray-600 font-semibold">Countries</p>
            <p className="text-sm text-gray-500 mt-2">Serving travelers on every continent</p>
          </div>
          <div className="py-6">
            <h3 className="font-playfair text-4xl md:text-5xl font-bold text-blue-600 mb-2">98%</h3>
            <p className="text-gray-600 font-semibold">Satisfaction</p>
            <p className="text-sm text-gray-500 mt-2">Customer satisfaction rate</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-6 md:px-16 lg:px-24 xl:px-32 py-16 md:py-20">
        <div className="text-center mb-12">
          <Title 
            title="Meet Our Team" 
            subTitle="Dedicated professionals committed to making your travel dreams come true"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Team Member 1 */}
          <div className="text-center">
            <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-6xl">👨‍💼</div>
            </div>
            <h3 className="font-playfair text-lg font-bold text-gray-900">Alex Johnson</h3>
            <p className="text-blue-600 font-semibold text-sm mb-2">Founder & CEO</p>
            <p className="text-gray-600 text-sm">Visionary leader with 20+ years in hospitality</p>
          </div>

          {/* Team Member 2 */}
          <div className="text-center">
            <div className="w-full h-64 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-6xl">👩‍💻</div>
            </div>
            <h3 className="font-playfair text-lg font-bold text-gray-900">Sarah Chen</h3>
            <p className="text-blue-600 font-semibold text-sm mb-2">Chief Technology Officer</p>
            <p className="text-gray-600 text-sm">Tech innovator driving our digital experience</p>
          </div>

          {/* Team Member 3 */}
          <div className="text-center">
            <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-6xl">👩‍🔬</div>
            </div>
            <h3 className="font-playfair text-lg font-bold text-gray-900">Maria Rodriguez</h3>
            <p className="text-blue-600 font-semibold text-sm mb-2">VP of Operations</p>
            <p className="text-gray-600 text-sm">Ensuring excellence in every partnership</p>
          </div>

          {/* Team Member 4 */}
          <div className="text-center">
            <div className="w-full h-64 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-6xl">👨‍🎓</div>
            </div>
            <h3 className="font-playfair text-lg font-bold text-gray-900">David Park</h3>
            <p className="text-blue-600 font-semibold text-sm mb-2">Head of Guest Relations</p>
            <p className="text-gray-600 text-sm">Your dedicated support and success advocate</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 md:px-16 lg:px-24 xl:px-32 py-16 md:py-20 rounded-2xl mx-6 md:mx-16 lg:mx-24 xl:mx-32 my-12 md:my-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Next Adventure?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Explore thousands of amazing properties and book your perfect stay today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Explore Hotels
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
