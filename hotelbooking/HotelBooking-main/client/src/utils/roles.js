// Role management utilities
import { supabase } from '../services/api.js'

const rawApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api'
const sanitizedApiUrl = rawApiUrl.replace(/\/$/, '')
const apiBaseUrl = sanitizedApiUrl.endsWith('/api') ? sanitizedApiUrl : `${sanitizedApiUrl}/api`

// Update user role in Supabase
export const updateUserRole = async (userId, role) => {
  try {
    // Call the API endpoint instead of directly updating Supabase
    const response = await fetch(`${apiBaseUrl}/user/update-role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userId: userId,
        role: role 
      })
    });

    const text = await response.text();
    const result = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(result?.message || `Request failed with status ${response.status}`)
    }
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return { success: true, data: result.data }
  } catch (error) {
    console.error('Error updating user role:', error)
    return { success: false, error: error.message }
  }
}

// Get all users (admin function)
export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { success: false, error: error.message }
  }
}

// Check if current user can access owner features
export const canAccessOwnerFeatures = (user) => {
  return user && user.role === 'OWNER'
}

// Validate role
export const isValidRole = (role) => {
  return Object.values(USER_ROLES).includes(role)
}

// Promote user to hotel owner
export const promoteToHotelOwner = async (clerkUserId) => {
  try {
    const result = await updateUserRole(clerkUserId, USER_ROLES.OWNER)
    if (result.success) {
      console.log('User promoted to hotel owner successfully')
      // Don't reload - let the caller handle navigation
    }
    return result
  } catch (error) {
    console.error('Error promoting user:', error)
    return { success: false, error: error.message }
  }
}

// User roles enum
export const USER_ROLES = {
  USER: 'USER',
  OWNER: 'OWNER'
}

// Role display names
export const ROLE_NAMES = {
  USER: 'Regular User',
  OWNER: 'Hotel Owner'
}
