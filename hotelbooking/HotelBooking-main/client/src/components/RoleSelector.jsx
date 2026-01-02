import React, { useState } from 'react'
import { useSupabaseUser } from '../utils/auth-clerk.jsx'
import { updateUserRole, USER_ROLES, ROLE_NAMES } from '../utils/roles'

const RoleSelector = () => {
  const { user, clerkUser } = useSupabaseUser()
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState('')

  const handleRoleChange = async (newRole) => {
    if (!clerkUser) {
      setMessage('Error: No user logged in')
      return
    }

    setIsUpdating(true)
    setMessage('')

    try {
      console.log('Updating role for user:', clerkUser.id, 'to', newRole)
      const result = await updateUserRole(clerkUser.id, newRole)
      
      if (result.success) {
        setMessage(`✅ Role updated to ${ROLE_NAMES[newRole]} successfully!`)
        // Refresh the page to update the UI after 1 second
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        setMessage(`❌ Error: ${result.error}`)
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`)
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setIsUpdating(false)
    }
  }

  if (!user) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 max-w-xs">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">🔧 Dev: Change Role</h3>
      <div className="text-xs text-gray-600 mb-3">
        <span className="font-medium">Current Role:</span> 
        <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded">
          {ROLE_NAMES[user.role] || 'Unknown'}
        </span>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => handleRoleChange(USER_ROLES.USER)}
          disabled={isUpdating || user.role === USER_ROLES.USER}
          className="flex-1 px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Make User
        </button>
        <button
          onClick={() => handleRoleChange(USER_ROLES.OWNER)}
          disabled={isUpdating || user.role === USER_ROLES.OWNER}
          className="flex-1 px-3 py-2 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Make Owner
        </button>
      </div>
      
      {message && (
        <div className={`mt-2 text-xs p-2 rounded ${
          message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}
      
      {isUpdating && (
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
          Updating...
        </div>
      )}
    </div>
  )
}

export default RoleSelector
