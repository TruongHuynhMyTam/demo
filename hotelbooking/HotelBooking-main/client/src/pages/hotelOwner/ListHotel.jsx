import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import { getHotelsByOwner, supabase } from "../../services/api";
import { useSupabaseUser } from "../../utils/auth-clerk.jsx";

export const ListHotel = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useSupabaseUser();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState({});

  useEffect(() => {
    const fetchHotels = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        const result = await getHotelsByOwner(user.id);
        
        if (result.success) {
          setHotels(result.data);
        } else {
          setError('Failed to load hotels: ' + result.error);
        }
      } catch (err) {
        setError('Failed to load hotels: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchHotels();
    }
  }, [user, isAuthenticated, authLoading]);

  const handleDeleteHotel = async (hotelId) => {
    if (!confirm('Are you sure you want to delete this hotel? All rooms will also be deleted.')) {
      return;
    }

    setDeleteLoading(prev => ({ ...prev, [hotelId]: true }));
    
    try {
      // First delete all rooms
      const { error: roomsError } = await supabase
        .from('rooms')
        .delete()
        .eq('hotel_id', hotelId);

      if (roomsError) {
        throw new Error('Failed to delete rooms: ' + roomsError.message);
      }

      // Then delete hotel
      const { error: hotelError } = await supabase
        .from('hotels')
        .delete()
        .eq('id', hotelId);
      
      if (hotelError) {
        throw new Error('Failed to delete hotel: ' + hotelError.message);
      }

      setHotels(prevHotels => prevHotels.filter(hotel => hotel.id !== hotelId));
      alert('Hotel deleted successfully');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setDeleteLoading(prev => ({ ...prev, [hotelId]: false }));
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
        <p className="text-gray-600">You need to be signed in to manage hotels.</p>
      </div>
    );
  }

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Hotel Listings"
        subTitle="View and manage all your hotels."
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading hotels...</p>
          </div>
        </div>
      ) : hotels.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">No hotels found. Add your first hotel to get started!</p>
          <a 
            href="/owner/add-hotel" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Hotel
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              {hotel.image && (
                <img 
                  src={hotel.image} 
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{hotel.name}</h3>
                <p className="text-gray-600 text-sm mb-1">
                  <span className="font-medium">Address:</span> {hotel.address}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  <span className="font-medium">City:</span> {hotel.city}
                </p>
                {hotel.country && (
                  <p className="text-gray-600 text-sm mb-3">
                    <span className="font-medium">Country:</span> {hotel.country}
                  </p>
                )}
                {hotel.description && (
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{hotel.description}</p>
                )}
                
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleDeleteHotel(hotel.id)}
                    disabled={deleteLoading[hotel.id]}
                    className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded transition-colors ${
                      deleteLoading[hotel.id]
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {deleteLoading[hotel.id] ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
