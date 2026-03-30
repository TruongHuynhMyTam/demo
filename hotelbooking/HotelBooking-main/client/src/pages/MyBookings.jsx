import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { getUserBookings, deleteBooking } from "../services/api";
import { useSupabaseUser } from "../utils/auth-clerk.jsx";

export const MyBookings = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useSupabaseUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getUserBookings(user.id);
        
        if (result.success) {
          setBookings(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchBookings();
    }
  }, [user, isAuthenticated, authLoading]);

  const handlePayment = (bookingId) => {
    navigate(`/payment/${bookingId}`);
  };

  const handleDeleteBooking = async (bookingId) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this booking?");
    if (!shouldDelete) return;

    setDeleteLoading((prev) => ({ ...prev, [bookingId]: true }));

    try {
      const result = await deleteBooking(bookingId);

      if (result.success) {
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.id !== bookingId)
        );
      } else {
        alert("Delete failed: " + result.error);
      }
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  if (authLoading) {
    return (
      <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
          <p className="text-gray-600">You need to be signed in to view your bookings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-8 lg:px-12 xl:px-16">
      <Title
        title="My Bookings"
        subTitle="Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks"
        align="left"
      />

      <div className="max-w-6xl mt-8 w-full text-gray-800">
        <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
          <div className="w-1/3">Hotels</div>
          <div className="w-1/3">Date & Timings</div>
          <div className="w-1/3">Payment</div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your bookings...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-600 mb-4">Error loading bookings: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : bookings && bookings.length > 0 ? (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t"
            >
              {/* ------ Hotel Details ---- */}
              <div className="flex gap-4">
                <img
                  src={booking.rooms?.images && booking.rooms.images.length > 0 ? booking.rooms.images[0] : assets.roomImg1}
                  alt="hotel-img"
                  className="w-32 h-24 rounded shadow object-cover flex-shrink-0"
                />
                <div className="flex flex-col gap-1">
                  <p className="font-playfair text-lg font-semibold">
                    {booking.rooms?.hotels?.name || 'Hotel Name'}
                    <span className="font-inter text-sm text-gray-600">
                      ({booking.rooms?.room_type || 'Room Type'})
                    </span>
                  </p>

                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <img
                      src={assets.locationIcon}
                      alt="location-icon"
                      className="w-4 h-4"
                    />
                    <span>{booking.rooms?.hotels?.address || 'Address'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <img
                      src={assets.guestsIcon}
                      alt="guests-icon"
                      className="w-4 h-4"
                    />
                    <span>Guests: {booking.number_of_guests}</span>
                  </div>
                  <p className="text-base">Total: ${booking.total_price}</p>
                </div>
              </div>
              {/* ------ Date & Timings ---- */}
              <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
                <div>
                  <p>Check-In:</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(booking.check_in_date).toDateString()}
                  </p>
                </div>
                <div>
                  <p>Check-Out:</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(booking.check_out_date).toDateString()}
                  </p>
                </div>
              </div>
              {/* Payment Status */}
              <div className="flex flex-col items-start justify-center pt-3">
                <div className="flex items-center gap-2">
                  {/* Status indicator */}
                  <div
                    className={`h-3 w-3 rounded-full ${
                      booking.is_paid ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      booking.is_paid ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {booking.is_paid ? "Paid" : "Unpaid"}
                  </p>
                </div>
                {/* Payment button when unpaid */}
                {!booking.is_paid && (
                  <button
                    onClick={() => handlePayment(booking.id)}
                    className={`mt-4 px-4 py-1.5 text-xs border border-gray-400 rounded-full 
                     hover:bg-gray-50 transition-all cursor-pointer`}
                  >
                    Pay Now
                  </button>
                )}
                {!booking.is_paid && (
                  <button
                    onClick={() => handleDeleteBooking(booking.id)}
                    disabled={deleteLoading[booking.id]}
                    className={`mt-3 px-4 py-1.5 text-xs border border-red-300 text-red-600 rounded-full
                      hover:bg-red-50 transition-all cursor-pointer ${
                        deleteLoading[booking.id] ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    {deleteLoading[booking.id] ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No bookings found</p>
            <p className="text-gray-400 text-sm mt-2">
              You haven't made any reservations yet
            </p>
            <button 
              onClick={() => window.location.href = '/rooms'}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Browse Rooms
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default MyBookings;
