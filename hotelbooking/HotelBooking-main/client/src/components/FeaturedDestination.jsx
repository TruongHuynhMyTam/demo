import React, { useState, useEffect } from 'react'
import { getAllRooms } from '../services/api'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'

const FeaturedDestination = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedRooms = async () => {
      setIsLoading(true);
      try {
        const response = await getAllRooms();
        if (response.success) {
          console.log('API Response:', response.data); // Debug log
          // Get first 4 rooms as featured
          setFeaturedRooms(response.data.slice(0, 4));
        } else {
          console.error('Failed to load featured rooms:', response.error);
        }
      } catch (error) {
        console.error('Error loading featured rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedRooms();
  }, []);

  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20">
      <Title
        title="Featured Destination"
        subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12 mt-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading featured destinations...</span>
        </div>
      ) : featuredRooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-20">
          {featuredRooms.map((room, index) => (
            <HotelCard key={room.id} room={room} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 mt-20">
          <p className="text-gray-600">No featured destinations available at the moment.</p>
        </div>
      )}
      <button onClick={() => {navigate('/rooms'); scrollTo(0,0)}}
      className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'>
        View All Destinations
      </button>
    </div>
  );
};

export default FeaturedDestination