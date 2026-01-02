import React, { useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/Title";
import { supabase } from "../../services/api";
import { useSupabaseUser } from "../../utils/auth-clerk.jsx";

export const AddHotel = () => {
  const { user, isAuthenticated } = useSupabaseUser();
  
  const [image, setImage] = useState(null);
  const [inputs, setInputs] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      alert('Please sign in to add a hotel');
      return;
    }

    if (!inputs.name || !inputs.address || !inputs.city) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let imageUrl = null;

      // Upload image if selected
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `hotel-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('hotel-images')
          .upload(filePath, image);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          alert('Warning: Failed to upload image. Hotel will be created without image.');
        } else {
          const { data: publicData } = supabase.storage
            .from('hotel-images')
            .getPublicUrl(filePath);
          
          imageUrl = publicData.publicUrl;
          console.log('Image uploaded:', imageUrl);
        }
      }

      // Create hotel
      const { data, error: hotelError } = await supabase
        .from('hotels')
        .insert({
          name: inputs.name,
          address: inputs.address,
          location: inputs.address,
          city: inputs.city,
          country: inputs.country || 'Vietnam',
          description: inputs.description,
          image: imageUrl,
          owner_id: user.id,
        })
        .select()
        .single();

      if (hotelError) {
        throw new Error(hotelError.message);
      }

      alert('Hotel added successfully!');
      console.log('Hotel created:', data);
      
      // Reset form
      setImage(null);
      setInputs({
        name: "",
        address: "",
        city: "",
        country: "",
        description: "",
      });
    } catch (err) {
      setError(err.message);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
        <p className="text-gray-600">You need to be signed in to add hotels.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Title
        align="left"
        font="outfit"
        title="Add Hotel"
        subTitle="Create a new hotel to manage rooms and bookings."
      />

      {/* Upload Area For Image */}
      <p className="text-gray-800 mt-10">Hotel Image</p>
      <div className="my-2">
        <label htmlFor="hotelImage">
          <img
            className="max-h-40 cursor-pointer opacity-80 border border-gray-300 rounded"
            src={image ? URL.createObjectURL(image) : assets.uploadArea}
            alt="Upload"
          />
          <input
            type="file"
            accept="image/*"
            id="hotelImage"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          {error}
        </div>
      )}

      <div className="w-full max-w-lg">
        <div>
          <p className="text-gray-800 mt-4">Hotel Name *</p>
          <input
            type="text"
            placeholder="Enter hotel name..."
            className="border border-gray-300 mt-1 rounded p-2 w-full"
            value={inputs.name}
            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
            required
          />
        </div>

        <div>
          <p className="text-gray-800 mt-4">Address *</p>
          <input
            type="text"
            placeholder="Enter full address..."
            className="border border-gray-300 mt-1 rounded p-2 w-full"
            value={inputs.address}
            onChange={(e) => setInputs({ ...inputs, address: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-800 mt-4">City *</p>
            <input
              type="text"
              placeholder="City name..."
              className="border border-gray-300 mt-1 rounded p-2 w-full"
              value={inputs.city}
              onChange={(e) => setInputs({ ...inputs, city: e.target.value })}
              required
            />
          </div>
          <div>
            <p className="text-gray-800 mt-4">Country</p>
            <input
              type="text"
              placeholder="Country name..."
              className="border border-gray-300 mt-1 rounded p-2 w-full"
              value={inputs.country}
              onChange={(e) => setInputs({ ...inputs, country: e.target.value })}
            />
          </div>
        </div>

        <div>
          <p className="text-gray-800 mt-4">Description</p>
          <textarea
            placeholder="Enter hotel description..."
            className="border border-gray-300 mt-1 rounded p-2 w-full"
            rows="4"
            value={inputs.description}
            onChange={(e) => setInputs({ ...inputs, description: e.target.value })}
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className={`${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white px-8 py-3 rounded-lg mt-8 font-medium transition-colors`}
        >
          {loading ? 'Adding Hotel...' : 'Add Hotel'}
        </button>
      </div>
    </form>
  );
};
