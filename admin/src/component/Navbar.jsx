import React from 'react'
import { assets } from '../assets/assets_admin/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'

function Navbar() {
  const { aToken, setAToken } = React.useContext(AdminContext)
  const {dToken , setDToken} = React.useContext(DoctorContext)
  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    aToken && setAToken('')
    localStorage.removeItem('aToken')

    dToken && setDToken('')
    localStorage.removeItem('dToken')
  }

  return (
    <div className="w-full bg-white border-b px-4 sm:px-6 md:px-10 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Left Side: Logo + Role */}
      <div className="flex items-center gap-4">
        <img
          src={assets.admin_logo}
          alt="logo"
          className="h-8 sm:h-10 md:h-12 w-auto object-contain"
        />
        <p className="px-3 sm:px-4 py-1 sm:py-1.5 border border-gray-300 rounded-full text-xs sm:text-sm md:text-base font-medium text-gray-800 bg-gradient-to-r from-gray-50 to-gray-100">
          {aToken ? 'Admin' : 'Doctor'}
        </p>
      </div>

      {/* Right Side: Logout Button */}
      <button
        onClick={logout}
        className="text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 
          bg-gradient-to-r from-primary to-primary/80 
          hover:from-primary/90 hover:to-primary 
          text-white font-semibold antialiased
          rounded-full
          transition-all duration-300 transform-gpu hover:scale-105"
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar
