import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const HotelCard = ({ room, index }) => {
  // Get image - support both formats (single image and array)
  const getImage = () => {
    // Priority: room.image (from database) > room.images[0] > fallback
    if (room.image) {
      console.log('Using room.image:', room.image);
      return room.image;
    }
    if (room.images && room.images.length > 0) {
      console.log('Using room.images[0]:', room.images[0]);
      return room.images[0];
    }
    console.log('Using fallback image for room:', room.id || room.type);
    return assets.roomImg1 || '/placeholder.jpg';
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-shadow">
      <Link
        to={"/rooms/" + room.id}
        onClick={() => scrollTo(0, 0)}
        key={room.id}
        className="block"
      >
        <img 
          src={getImage()} 
          alt={room.type || room.room_type || 'Hotel Room'}
          className="w-full h-52 object-cover"
          onError={(e) => {
            e.target.src = assets.roomImg1;
          }}
        />

        {index % 2 === 0 && (
          <p
            className="px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full"
          >
            Best Seller
          </p>
        )}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-playfair text-lg font-medium text-gray-800 line-clamp-1">
              {room.hotels?.name || room.type || room.room_type || 'Hotel Room'}
            </p>
            <div className="flex items-center gap-1 flex-shrink-0">
              <img src={assets.starIconFilled} alt="star-icon" className="w-4 h-4" /> 
              <span className="text-sm">4.5</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm mb-3">
            <img src={assets.locationIcon} alt="location-icon" className="w-4 h-4" />
            <span className="line-clamp-1">{room.hotels?.address || room.location || room.hotels?.city || 'Location'}</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p>
              <span className="text-xl font-semibold text-gray-800">
                ${room.price || room.price_per_night || room.pricePerNight || 0}
              </span>
              <span className="text-sm text-gray-600">/night</span>
            </p>
            <button
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-all cursor-pointer"
            >
              Book Now
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HotelCard;
