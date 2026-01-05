import { supabase } from "../configs/db.js";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

//api to create, get, delete rooms

export const createRoom = async (req, res) => {
  try {
    const { hotelId, roomType, pricePerNight, maxGuests, description, amenities, images: imageUrls } = req.body;
    
    // Validate required fields
    if (!hotelId || !roomType || !pricePerNight) {
      return res.json({ success: false, message: "Missing required fields: hotelId, roomType, or pricePerNight" });
    }

    // Verify that the hotel belongs to the authenticated user
    const { data: hotel, error: hotelError } = await supabase
      .from('hotels')
      .select('id, name')
      .eq('id', hotelId)
      .eq('owner_id', req.auth.userId)
      .single();

    if (hotelError || !hotel) {
      return res.json({ success: false, message: "Hotel not found or you don't have permission" });
    }

    // Parse amenities if it's a string
    const parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
    const parsedImages = typeof imageUrls === 'string' ? JSON.parse(imageUrls) : imageUrls;

    const { error: roomError } = await supabase
      .from('rooms')
      .insert({
        hotel_id: hotelId,
        name: roomType, // Use roomType as name
        description: description || `${roomType} room at ${hotel.name}`,
        type: roomType,
        room_type: roomType,
        price: parseFloat(pricePerNight),
        price_per_night: parseFloat(pricePerNight),
        max_guests: parseInt(maxGuests) || 2,
        image: parsedImages && parsedImages.length > 0 ? parsedImages[0] : null,
        images: parsedImages || [],
        amenities: parsedAmenities || [],
        is_available: true
      });

    if (roomError) {
      console.error('Room creation error:', roomError);
      return res.json({ success: false, message: roomError.message });
    }

    res.json({ success: true, message: "Room created successfully" });
  } catch (error) {
    console.error('Error in createRoom:', error);
    res.json({ success: false, message: error.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select(`
        *,
        hotel:hotels (
          *,
          owner:users!hotels_owner_id_fkey (
            image
          )
        )
      `)
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (error) {
      return res.json({ success: false, message: error.message });
    }

    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get all rooms for a specific hotel
export const getOwnerRooms = async (req, res) => {
  try {
    const { data: hotel, error: hotelError } = await supabase
      .from('hotels')
      .select('id')
      .eq('owner_id', req.auth.userId)
      .single();

    if (hotelError || !hotel) {
      return res.json({ success: false, message: "No Hotel found" });
    }

    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select(`
        *,
        hotel:hotels (*)
      `)
      .eq('hotel_id', hotel.id);

    if (roomsError) {
      return res.json({ success: false, message: roomsError.message });
    }

    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to toggle availability of a room
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    
    const { data: room, error: fetchError } = await supabase
      .from('rooms')
      .select('is_available')
      .eq('id', roomId)
      .single();

    if (fetchError || !room) {
      return res.json({ success: false, message: "Room not found" });
    }

    const { error: updateError } = await supabase
      .from('rooms')
      .update({ is_available: !room.is_available })
      .eq('id', roomId);

    if (updateError) {
      return res.json({ success: false, message: updateError.message });
    }

    res.json({ success: true, message: "Room availability updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

