import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookingById, updateBookingPaymentStatus } from "../services/api";
import { useSupabaseUser } from "../utils/auth-clerk.jsx";

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useSupabaseUser();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId || !isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result = await getBookingById(bookingId);

        if (!result.success) {
          setError(result.error || "Cannot load booking");
          return;
        }

        if (result.data.user_id !== user.id) {
          setError("You do not have permission to pay for this booking.");
          return;
        }

        setBooking(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchBooking();
    }
  }, [authLoading, bookingId, isAuthenticated, user]);

  const pricing = useMemo(() => {
    if (!booking) {
      return { roomRate: 0, taxFees: 0, total: 0 };
    }

    const total = Number(booking.total_price || 0);
    const roomRate = total * 0.8;
    const taxFees = total - roomRate;

    return { roomRate, taxFees, total };
  }, [booking]);

  const handlePay = async () => {
    if (!booking) return;

    if (!acceptedTerms) {
      alert("Please accept Terms and Conditions before payment.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await updateBookingPaymentStatus(booking.id, true);
      if (!result.success) {
        alert(`Payment failed: ${result.error}`);
        return;
      }

      alert("Payment successful");
      navigate("/my-bookings");
    } catch (err) {
      alert(`Payment failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="py-28 px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading payment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="py-28 px-4 md:px-8 lg:px-12 xl:px-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Please Sign In</h2>
        <p className="text-gray-600">You need to sign in to continue payment.</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="py-28 px-4 md:px-8 lg:px-12 xl:px-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Payment Not Available</h2>
        <p className="text-red-600 mb-5">{error || "Booking not found"}</p>
        <button
          onClick={() => navigate("/my-bookings")}
          className="px-5 py-2 rounded border border-gray-300 hover:bg-gray-50"
        >
          Back to My Bookings
        </button>
      </div>
    );
  }

  const roomName = booking.rooms?.room_type || booking.room?.room_type || "Room";
  const hotelName =
    booking.rooms?.hotels?.name || booking.room?.hotels?.name || booking.hotel?.name || "Hotel";

  return (
    <div className="py-28 px-4 md:px-8 lg:px-12 xl:px-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-5">Order Summary</h2>
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="space-y-4 text-gray-600">
              <div>
                <p className="text-sm">Hotel</p>
                <p className="text-3xl font-semibold text-gray-900 leading-tight">{hotelName}</p>
              </div>
              <div>
                <p className="text-sm">Room Type</p>
                <p className="text-3xl font-semibold text-gray-900 leading-tight">{roomName}</p>
              </div>
              <div>
                <p className="text-sm">Check-In</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Date(booking.check_in_date).toDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm">Check-Out</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Date(booking.check_out_date).toDateString()}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6 space-y-3 text-gray-700">
              <div className="flex items-center justify-between">
                <span>Room Rate:</span>
                <span>${pricing.roomRate.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax & Fees:</span>
                <span>${pricing.taxFees.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex items-center justify-between text-3xl font-bold text-gray-900">
                <span>Total:</span>
                <span className="text-blue-600">${pricing.total.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-5">Payment Method</h2>

          <div className="space-y-5">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`w-full rounded-2xl border p-6 text-left transition-all ${
                paymentMethod === "card"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-2xl font-semibold text-gray-900">Credit/Debit Card</span>
            </button>

            <button
              onClick={() => setPaymentMethod("bank")}
              className={`w-full rounded-2xl border p-6 text-left transition-all ${
                paymentMethod === "bank"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-2xl font-semibold text-gray-900">Bank Transfer</span>
            </button>

            <label className="flex items-start gap-3 text-gray-600 mt-2">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 h-5 w-5"
              />
              <span>
                I agree to the <span className="text-blue-600 font-medium">Terms and Conditions</span> and <span className="text-blue-600 font-medium">Privacy Policy</span>
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => navigate("/my-bookings")}
                className="w-full rounded-xl border border-gray-300 py-4 text-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handlePay}
                disabled={submitting || booking.is_paid}
                className={`w-full rounded-xl py-4 text-lg font-semibold text-white ${
                  submitting || booking.is_paid
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {booking.is_paid
                  ? "Already Paid"
                  : submitting
                  ? "Processing..."
                  : `Pay $${pricing.total.toFixed(0)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
